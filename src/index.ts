import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {
    isStorageDriverOverlay, findFuseOverlayfsPath,
    splitByNewline,
    isFullImageName, getFullImageName,
    getFullDockerImageName,
} from "./util";
import { Inputs, Outputs } from "./generated/inputs-outputs";

interface ExecResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}

interface ImageStorageCheckResult {
    readonly foundTags: string[];
    readonly missingTags: string[];
}

let podmanPath: string | undefined;

// boolean value to check if pushed image is from Docker image storage
let isImageFromDocker = false;
let sourceImages: string[];
let destinationImages: string[];
let dockerPodmanRoot: string;
let dockerPodmanOpts: string[];

async function getPodmanPath(): Promise<string> {
    if (podmanPath == null) {
        podmanPath = await io.which("podman", true);
        await execute(podmanPath, [ "version" ], { group: true });
    }

    return podmanPath;
}

async function run(): Promise<void> {
    const DEFAULT_TAG = "latest";
    const image = core.getInput(Inputs.IMAGE);
    const tags = core.getInput(Inputs.TAGS);
    // split tags
    const tagsList = tags.trim().split(/\s+/);

    // info message if user doesn't provides any tag
    if (tagsList.length === 0) {
        core.info(`Input "${Inputs.TAGS}" is not provided, using default tag "${DEFAULT_TAG}"`);
        tagsList.push(DEFAULT_TAG);
    }

    const normalizedTagsList: string[] = [];
    let isNormalized = false;
    for (const tag of tagsList) {
        normalizedTagsList.push(tag.toLowerCase());
        if (tag.toLowerCase() !== tag) {
            isNormalized = true;
        }
    }
    const normalizedImage = image.toLowerCase();
    if (isNormalized || image !== normalizedImage) {
        core.warning(`Reference to image and/or tag must be lowercase.`
        + ` Reference has been converted to be compliant with standard.`);
    }

    const registry = core.getInput(Inputs.REGISTRY);
    const username = core.getInput(Inputs.USERNAME);
    const password = core.getInput(Inputs.PASSWORD);
    const tlsVerify = core.getInput(Inputs.TLS_VERIFY);
    const digestFileInput = core.getInput(Inputs.DIGESTFILE);

    // check if all tags provided are in `image:tag` format
    const isFullImageNameTag = isFullImageName(normalizedTagsList[0]);
    if (normalizedTagsList.some((tag) => isFullImageName(tag) !== isFullImageNameTag)) {
        throw new Error(`Input "${Inputs.TAGS}" cannot have a mix of full name and non full name tags`);
    }
    if (!isFullImageNameTag) {
        if (!normalizedImage) {
            throw new Error(`Input "${Inputs.IMAGE}" must be provided when using non full name tags`);
        }
        if (!registry) {
            throw new Error(`Input "${Inputs.REGISTRY}" must be provided when using non full name tags`);
        }

        const registryWithoutTrailingSlash = registry.replace(/\/$/, "");
        const registryPath = `${registryWithoutTrailingSlash}/${normalizedImage}`;
        core.info(`Combining image name "${normalizedImage}" and registry "${registry}" `
            + `to form registry path "${registryPath}"`);
        if (normalizedImage.indexOf("/") > -1 && registry.indexOf("/") > -1) {
            core.warning(`"${registryPath}" does not seem to be a valid registry path. `
            + `The registry path should not contain more than 2 slashes. `
            + `Refer to the Inputs section of the readme for naming image and registry.`);
        }

        sourceImages = normalizedTagsList.map((tag) => getFullImageName(normalizedImage, tag));
        destinationImages = normalizedTagsList.map((tag) => getFullImageName(registryPath, tag));
    }
    else {
        if (normalizedImage) {
            core.warning(`Input "${Inputs.IMAGE}" is ignored when using full name tags`);
        }
        if (registry) {
            core.warning(`Input "${Inputs.REGISTRY}" is ignored when using full name tags`);
        }

        sourceImages = normalizedTagsList;
        destinationImages = normalizedTagsList;
    }

    const inputExtraArgsStr = core.getInput(Inputs.EXTRA_ARGS);
    let podmanExtraArgs: string[] = [];
    if (inputExtraArgsStr) {
        // transform the array of lines into an array of arguments
        // by splitting over lines, then over spaces, then trimming.
        const lines = splitByNewline(inputExtraArgsStr);
        podmanExtraArgs = lines.flatMap((line) => line.split(" ")).map((arg) => arg.trim());
    }

    const registryPathList: string[] = [];
    // here
    // check if provided image is manifest or not
    const isManifest = await checkIfManifestsExists();

    if (!isManifest) {
        // check if image with all the required tags exist in Podman image storage
        const podmanImageStorageCheckResult: ImageStorageCheckResult = await checkImageInPodman();

        const podmanFoundTags: string[] = podmanImageStorageCheckResult.foundTags;
        const podmanMissingTags: string[] = podmanImageStorageCheckResult.missingTags;

        if (podmanFoundTags.length > 0) {
            core.info(`Tag${podmanFoundTags.length !== 1 ? "s" : ""} "${podmanFoundTags.join(", ")}" `
            + `found in Podman image storage`);
        }

        // Log warning if few tags are not found
        if (podmanMissingTags.length > 0 && podmanFoundTags.length > 0) {
            core.warning(`Tag${podmanMissingTags.length !== 1 ? "s" : ""} "${podmanMissingTags.join(", ")}" `
            + `not found in Podman image storage`);
        }

        // check if image with all the required tags exist in Docker image storage
        // and if exist pull the image with all the tags to Podman
        const dockerImageStorageCheckResult: ImageStorageCheckResult = await pullImageFromDocker();

        const dockerFoundTags: string[] = dockerImageStorageCheckResult.foundTags;
        const dockerMissingTags: string[] = dockerImageStorageCheckResult.missingTags;

        if (dockerFoundTags.length > 0) {
            core.info(`Tag${dockerFoundTags.length !== 1 ? "s" : ""} "${dockerFoundTags.join(", ")}" `
            + `found in Docker image storage`);
        }

        // Log warning if few tags are not found
        if (dockerMissingTags.length > 0 && dockerFoundTags.length > 0) {
            core.warning(`Tag${dockerMissingTags.length !== 1 ? "s" : ""} "${dockerMissingTags.join(", ")}" `
            + `not found in Docker image storage`);
        }

        // failing if image with any of the tag is not found in Docker as well as Podman
        if (podmanMissingTags.length > 0 && dockerMissingTags.length > 0) {
            throw new Error(
                `❌ All tags were not found in either Podman image storage, or Docker image storage. `
                + `Tag${podmanMissingTags.length !== 1 ? "s" : ""} "${podmanMissingTags.join(", ")}" `
                + `not found in Podman image storage, and tag${dockerMissingTags.length !== 1 ? "s" : ""} `
                + `"${dockerMissingTags.join(", ")}" not found in Docker image storage.`
            );
        }

        const allTagsinPodman: boolean = podmanFoundTags.length === normalizedTagsList.length;
        const allTagsinDocker: boolean = dockerFoundTags.length === normalizedTagsList.length;

        if (allTagsinPodman && allTagsinDocker) {
            const isPodmanImageLatest = await isPodmanLocalImageLatest();
            if (!isPodmanImageLatest) {
                core.warning(
                    `The version of "${sourceImages[0]}" in the Docker image storage is more recent `
                        + `than the version in the Podman image storage. The image(s) from the Docker image storage `
                        + `will be pushed.`
                );
                isImageFromDocker = true;
            }
            else {
                core.warning(
                    `The version of "${sourceImages[0]}" in the Podman image storage is more recent `
                        + `than the version in the Docker image storage. The image(s) from the Podman image `
                        + `storage will be pushed.`
                );
            }
        }
        else if (allTagsinDocker) {
            core.info(
                `Tag "${sourceImages[0]}" was found in the Docker image storage, but not in the Podman `
                    + `image storage. The image(s) will be pulled into Podman image storage, pushed, and then `
                    + `removed from the Podman image storage.`
            );
            isImageFromDocker = true;
        }
        else {
            core.info(
                `Tag "${sourceImages[0]}" was found in the Podman image storage, but not in the Docker `
                    + `image storage. The image(s) will be pushed from Podman image storage.`
            );
        }
    }

    let pushMsg = `⏳ Pushing "${sourceImages.join(", ")}" to "${destinationImages.join(", ")}" respectively`;
    if (username) {
        pushMsg += ` as "${username}"`;
    }
    core.info(pushMsg);

    let creds = "";
    if (username && !password) {
        core.warning("Username is provided, but password is missing");
    }
    else if (!username && password) {
        core.warning("Password is provided, but username is missing");
    }
    else if (username && password) {
        creds = `${username}:${password}`;
    }

    let digestFile = digestFileInput;
    if (!digestFile) {
        digestFile = `${sourceImages[0].replace(
            /[/\\/?%*:|"<>]/g,
            "-",
        )}_digest.txt`;
    }

    // push the image
    for (let i = 0; i < destinationImages.length; i++) {
        const args = [];
        if (isImageFromDocker) {
            args.push(...dockerPodmanOpts);
        }
        if (isManifest) {
            args.push("manifest");
        }
        args.push(...[
            "push",
            "--quiet",
            "--digestfile",
            digestFile,
            isImageFromDocker ? getFullDockerImageName(sourceImages[i]) : sourceImages[i],
            destinationImages[i],
        ]);
        // to push all the images referenced in the manifest
        if (isManifest) {
            args.push("--all");
        }
        if (podmanExtraArgs.length > 0) {
            args.push(...podmanExtraArgs);
        }

        // check if tls-verify is not set to null
        if (tlsVerify) {
            args.push(`--tls-verify=${tlsVerify}`);
        }

        // check if registry creds are provided
        if (creds) {
            args.push(`--creds=${creds}`);
        }

        await execute(await getPodmanPath(), args);
        core.info(`✅ Successfully pushed "${sourceImages[i]}" to "${destinationImages[i]}"`);

        registryPathList.push(destinationImages[i]);

        try {
            const digest = (await fs.promises.readFile(digestFile)).toString();
            core.info(digest);
            // the digest should be the same for every image, but we log it every time
            // due to https://github.com/redhat-actions/push-to-registry/issues/26
            core.setOutput(Outputs.DIGEST, digest);
        }
        catch (err) {
            core.warning(`Failed to read digest file "${digestFile}": ${err}`);
        }
    }

    core.setOutput(Outputs.REGISTRY_PATH, registryPathList[0]);
    core.setOutput(Outputs.REGISTRY_PATHS, JSON.stringify(registryPathList));
}

async function pullImageFromDocker(): Promise<ImageStorageCheckResult> {
    core.info(`🔍 Checking if "${sourceImages.join(", ")}" present in the local Docker image storage`);
    const foundTags: string[] = [];
    const missingTags: string[] = [];
    try {
        for (const imageWithTag of sourceImages) {
            const commandResult: ExecResult = await execute(
                await getPodmanPath(),
                [ ...dockerPodmanOpts, "pull", `docker-daemon:${imageWithTag}` ],
                { ignoreReturnCode: true, failOnStdErr: false, group: true }
            );
            if (commandResult.exitCode === 0) {
                foundTags.push(imageWithTag);
            }
            else {
                missingTags.push(imageWithTag);
            }
        }
    }
    catch (err) {
        core.warning(err);
    }

    return {
        foundTags,
        missingTags,
    };
}

async function checkImageInPodman(): Promise<ImageStorageCheckResult> {
    // check if images exist in Podman's storage
    core.info(`🔍 Checking if "${sourceImages.join(", ")}" present in the local Podman image storage`);
    const foundTags: string[] = [];
    const missingTags: string[] = [];
    try {
        for (const imageWithTag of sourceImages) {
            const commandResult: ExecResult = await execute(
                await getPodmanPath(),
                [ "image", "exists", imageWithTag ],
                { ignoreReturnCode: true }
            );
            if (commandResult.exitCode === 0) {
                foundTags.push(imageWithTag);
            }
            else {
                missingTags.push(imageWithTag);
            }
        }
    }
    catch (err) {
        core.debug(err);
    }

    return {
        foundTags,
        missingTags,
    };
}

async function isPodmanLocalImageLatest(): Promise<boolean> {
    // checking for only one tag as creation time will be
    // same for all the tags present
    const imageWithTag = sourceImages[0];

    // get creation time of the image present in the Podman image storage
    const podmanLocalImageTimeStamp = await execute(await getPodmanPath(), [
        "image",
        "inspect",
        imageWithTag,
        "--format",
        "{{.Created}}",
    ]);

    // get creation time of the image pulled from the Docker image storage
    // appending 'docker.io/library' infront of image name as pulled image name
    // from Docker image storage starts with the 'docker.io/library'
    const pulledImageCreationTimeStamp = await execute(await getPodmanPath(), [
        ...dockerPodmanOpts,
        "image",
        "inspect",
        getFullDockerImageName(imageWithTag),
        "--format",
        "{{.Created}}",
    ]);

    const podmanImageTime = new Date(podmanLocalImageTimeStamp.stdout).getTime();

    const dockerImageTime = new Date(pulledImageCreationTimeStamp.stdout).getTime();

    return podmanImageTime > dockerImageTime;
}

async function createDockerPodmanImageStroage(): Promise<void> {
    core.info(`Creating temporary Podman image storage for pulling from Docker daemon`);
    dockerPodmanRoot = await fs.promises.mkdtemp(path.join(os.tmpdir(), "podman-from-docker-"));

    dockerPodmanOpts = [ "--root", dockerPodmanRoot ];

    if (await isStorageDriverOverlay()) {
        const fuseOverlayfsPath = await findFuseOverlayfsPath();
        if (fuseOverlayfsPath) {
            core.info(`Overriding storage mount_program with "fuse-overlayfs" in environment`);
            dockerPodmanOpts.push("--storage-opt");
            dockerPodmanOpts.push(`overlay.mount_program=${fuseOverlayfsPath}`);
        }
        else {
            core.warning(`"fuse-overlayfs" is not found. Install it before running this action. `
            + `For more detail see https://github.com/redhat-actions/buildah-build/issues/45`);
        }
    }
    else {
        core.info("Storage driver is not 'overlay', so not overriding storage configuration");
    }
}

async function removeDockerPodmanImageStroage(): Promise<void> {
    if (dockerPodmanRoot) {
        try {
            core.info(`Removing temporary Podman image storage for pulling from Docker daemon`);
            await execute(
                await getPodmanPath(),
                [ ...dockerPodmanOpts, "rmi", "-a", "-f" ]
            );
            await fs.promises.rmdir(dockerPodmanRoot, { recursive: true });
        }
        catch (err) {
            core.warning(`Failed to remove podman image stroage ${dockerPodmanRoot}: ${err}`);
        }
    }
}

async function checkIfManifestsExists(): Promise<boolean> {
    const foundManifests = [];
    const missingManifests = [];
    // check if manifest exist in Podman's storage
    core.info(`🔍 Checking if the given image is manifest or not.`);
    for (const manifest of sourceImages) {
        const commandResult: ExecResult = await execute(
            await getPodmanPath(),
            [ "manifest", "exists", manifest ],
            { ignoreReturnCode: true, group: true }
        );
        if (commandResult.exitCode === 0) {
            foundManifests.push(manifest);
        }
        else {
            missingManifests.push(manifest);
        }
    }

    if (foundManifests.length > 0) {
        core.info(`Image${foundManifests.length !== 1 ? "s" : ""} "${foundManifests.join(", ")}" `
            + `${foundManifests.length !== 1 ? "are manifests" : "is a manifest"}.`);
    }

    if (foundManifests.length > 0 && missingManifests.length > 0) {
        throw new Error(`Manifest${missingManifests.length !== 1 ? "s" : ""} "${missingManifests.join(", ")}" `
            + `not found in the Podman image storage. Make sure that all the provided images are either `
            + `manifests or container images.`);
    }

    return foundManifests.length === sourceImages.length;
}

async function execute(
    executable: string,
    args: string[],
    execOptions: exec.ExecOptions & { group?: boolean } = {},
): Promise<ExecResult> {
    let stdout = "";
    let stderr = "";

    const finalExecOptions = { ...execOptions };
    finalExecOptions.ignoreReturnCode = true; // the return code is processed below

    finalExecOptions.listeners = {
        stdline: (line): void => {
            stdout += `${line}\n`;
        },
        errline: (line): void => {
            stderr += `${line}\n`;
        },
    };

    if (execOptions.group) {
        const groupName = [ executable, ...args ].join(" ");
        core.startGroup(groupName);
    }

    try {
        const exitCode = await exec.exec(executable, args, finalExecOptions);

        if (execOptions.ignoreReturnCode !== true && exitCode !== 0) {
            // Throwing the stderr as part of the Error makes the stderr show up in the action outline,
            // which saves some clicking when debugging.
            let error = `${path.basename(executable)} exited with code ${exitCode}`;
            if (stderr) {
                error += `\n${stderr}`;
            }
            throw new Error(error);
        }

        return {
            exitCode,
            stdout,
            stderr,
        };
    }

    finally {
        if (execOptions.group) {
            core.endGroup();
        }
    }
}

async function main(): Promise<void> {
    try {
        await createDockerPodmanImageStroage();
        await run();
    }
    finally {
        await removeDockerPodmanImageStroage();
    }
}

main()
    .catch((err) => {
        core.setFailed(err.message);
    });
