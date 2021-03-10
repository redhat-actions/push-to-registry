import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as fs from "fs";
import * as path from "path";
import { splitByNewline } from "./util";
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
let imageToPush: string;
let tagsList: string[];

async function getPodmanPath(): Promise<string> {
    if (podmanPath == null) {
        podmanPath = await io.which("podman", true);
        await execute(podmanPath, [ "version" ]);
    }

    return podmanPath;
}

// base URL that gets appended if image is pulled from the Docker imaege storage
const dockerBaseUrl = "docker.io/library";

async function run(): Promise<void> {
    const DEFAULT_TAG = "latest";
    const imageInput = core.getInput(Inputs.IMAGE, { required: true });
    const tags = core.getInput(Inputs.TAGS);
    // split tags
    tagsList = tags.split(" ");

    // info message if user doesn't provides any tag
    if (!tagsList.length) {
        core.info(`Input "${Inputs.TAGS}" is not provided, using default tag "${DEFAULT_TAG}"`);
        tagsList.push(DEFAULT_TAG);
    }
    const registry = core.getInput(Inputs.REGISTRY, { required: true });
    const username = core.getInput(Inputs.USERNAME, { required: true });
    const password = core.getInput(Inputs.PASSWORD, { required: true });
    const tlsVerify = core.getInput(Inputs.TLS_VERIFY);
    const digestFileInput = core.getInput(Inputs.DIGESTFILE);

    const inputExtraArgsStr = core.getInput("extra-args");
    let podmanExtraArgs: string[] = [];
    if (inputExtraArgsStr) {
        // transform the array of lines into an array of arguments
        // by splitting over lines, then over spaces, then trimming.
        const lines = splitByNewline(inputExtraArgsStr);
        podmanExtraArgs = lines.flatMap((line) => line.split(" ")).map((arg) => arg.trim());
    }

    imageToPush = `${imageInput}`;
    const registryPathList: string[] = [];

    // check if image with all the required tags exist in Podman image storage
    const podmanImageStorageCheckResult: ImageStorageCheckResult = await checkImageInPodman();

    const podmanFoundTags: string[] = podmanImageStorageCheckResult.foundTags;
    const podmanMissingTags: string[] = podmanImageStorageCheckResult.missingTags;

    if (podmanFoundTags.length > 0) {
        core.info(`Tag${podmanFoundTags.length !== 1 ? "s" : ""} "${podmanFoundTags.join(", ")}" `
        + `of "${imageToPush}" found in Podman image storage`);
    }

    // Log warning if few tags are not found
    if (podmanMissingTags.length > 0 && podmanFoundTags.length > 0) {
        core.warning(`Tag${podmanMissingTags.length !== 1 ? "s" : ""} "${podmanMissingTags.join(", ")}" `
        + `of "${imageToPush}" not found in Podman image storage`);
    }

    // check if image with all the required tags exist in Docker image storage
    // and if exist pull the image with all the tags to Podman
    const dockerImageStorageCheckResult: ImageStorageCheckResult = await pullImageFromDocker();

    const dockerFoundTags: string[] = dockerImageStorageCheckResult.foundTags;
    const dockerMissingTags: string[] = dockerImageStorageCheckResult.missingTags;

    if (dockerFoundTags.length > 0) {
        core.info(`Tag${dockerFoundTags.length !== 1 ? "s" : ""} "${dockerFoundTags.join(", ")}" `
        + `of "${imageToPush}" found in Docker image storage`);
    }

    // Log warning if few tags are not found
    if (dockerMissingTags.length > 0 && dockerFoundTags.length > 0) {
        core.warning(`Tag${dockerMissingTags.length !== 1 ? "s" : ""} "${dockerMissingTags.join(", ")}" `
        + `of "${imageToPush}" not found in Docker image storage`);
    }

    // failing if image with any of the tag is not found in Docker as well as Podman
    if (podmanMissingTags.length > 0 && dockerMissingTags.length > 0) {
        throw new Error(
            `All tags for "${imageToPush}" were not found in either Podman image storage, or Docker image storage. `
            + `Tag${podmanMissingTags.length !== 1 ? "s" : ""} "${podmanMissingTags.join(", ")}" `
            + `not found in Podman image storage, and tag${dockerMissingTags.length !== 1 ? "s" : ""} `
            + `"${dockerMissingTags.join(", ")}" not found in Docker image storage.`
        );
    }

    const allTagsinPodman: boolean = podmanFoundTags.length === tagsList.length;
    const allTagsinDocker: boolean = dockerFoundTags.length === tagsList.length;

    if (allTagsinPodman && allTagsinDocker) {
        const isPodmanImageLatest = await isPodmanLocalImageLatest();
        if (!isPodmanImageLatest) {
            core.warning(
                `The version of "${imageToPush}" in the Docker image storage is more recent `
                    + `than the version in the Podman image storage. The image(s) from the Docker image storage `
                    + `will be pushed.`
            );
            imageToPush = `${dockerBaseUrl}/${imageToPush}`;
            isImageFromDocker = true;
        }
        else {
            core.warning(
                `The version of "${imageToPush}" in the Podman image storage is more recent `
                    + `than the version in the Docker image storage. The image(s) from the Podman image `
                    + `storage will be pushed.`
            );
        }
    }
    else if (allTagsinDocker) {
        imageToPush = `${dockerBaseUrl}/${imageToPush}`;
        core.info(
            `"${imageToPush}" was found in the Docker image storage, but not in the Podman `
                + `image storage. The image(s) will be pulled into Podman image storage, pushed, and then `
                + `removed from the Podman image storage.`
        );
        isImageFromDocker = true;
    }
    else {
        core.info(
            `"${imageToPush}" was found in the Podman image storage, but not in the Docker `
                + `image storage. The image(s) will be pushed from Podman image storage.`
        );
    }

    let pushMsg = `Pushing "${imageToPush}" with tag${tagsList.length !== 1 ? "s" : ""} `
    + `"${tagsList.join(", ")}" to "${registry}"`;
    if (username) {
        pushMsg += ` as "${username}"`;
    }
    core.info(pushMsg);

    const registryWithoutTrailingSlash = registry.replace(/\/$/, "");

    const creds = `${username}:${password}`;

    let digestFile = digestFileInput;
    const imageNameWithTag = `${imageToPush}:${tagsList[0]}`;
    if (!digestFile) {
        digestFile = `${imageNameWithTag.replace(
            /[/\\/?%*:|"<>]/g,
            "-",
        )}_digest.txt`;
    }

    // push the image
    for (const tag of tagsList) {
        const imageWithTag = `${imageToPush}:${tag}`;
        const registryPath = `${registryWithoutTrailingSlash}/${imageInput}:${tag}`;

        const args = [
            "push",
            "--quiet",
            "--digestfile",
            digestFile,
            "--creds",
            creds,
            imageWithTag,
            registryPath,
        ];

        if (podmanExtraArgs.length > 0) {
            args.push(...podmanExtraArgs);
        }

        // check if tls-verify is not set to null
        if (tlsVerify) {
            args.push(`--tls-verify=${tlsVerify}`);
        }

        await execute(await getPodmanPath(), args);
        core.info(`Successfully pushed "${imageWithTag}" to "${registryPath}"`);

        registryPathList.push(registryPath);

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
    core.info(`Checking if "${imageToPush}" with tag${tagsList.length !== 1 ? "s" : ""} `
    + `"${tagsList.join(", ")}" is present in Docker image storage`);
    let imageWithTag;
    const foundTags: string[] = [];
    const missingTags: string[] = [];
    try {
        for (const tag of tagsList) {
            imageWithTag = `${imageToPush}:${tag}`;
            const commandResult: ExecResult = await execute(
                await getPodmanPath(),
                [ "pull", `docker-daemon:${imageWithTag}` ],
                { ignoreReturnCode: true, failOnStdErr: false, group: true }
            );
            if (!commandResult.exitCode) {
                foundTags.push(tag);
            }
            else {
                missingTags.push(tag);
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

async function checkImageInPodman(): Promise<ImageStorageCheckResult> {
    // check if images exist in Podman's storage
    core.info(`Checking if "${imageToPush}" with tag${tagsList.length !== 1 ? "s" : ""} `
    + `"${tagsList.join(", ")}" is present in Podman image storage`);
    let imageWithTag;
    const foundTags: string[] = [];
    const missingTags: string[] = [];
    try {
        for (const tag of tagsList) {
            imageWithTag = `${imageToPush}:${tag}`;
            const commandResult: ExecResult = await execute(
                await getPodmanPath(),
                [ "image", "exists", imageWithTag ],
                { ignoreReturnCode: true }
            );
            if (!commandResult.exitCode) {
                foundTags.push(tag);
            }
            else {
                missingTags.push(tag);
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
    const imageWithTag = `${imageToPush}:${tagsList[0]}`;

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
        "image",
        "inspect",
        `${dockerBaseUrl}/${imageWithTag}`,
        "--format",
        "{{.Created}}",
    ]);

    const podmanImageTime = new Date(podmanLocalImageTimeStamp.stdout).getTime();

    const dockerImageTime = new Date(pulledImageCreationTimeStamp.stdout).getTime();

    return podmanImageTime > dockerImageTime;
}

// remove the pulled image from the Podman image storage
async function removeDockerImage(): Promise<void> {
    if (imageToPush) {
        core.info(`Removing "${imageToPush}" from the Podman image storage`);
        for (const tag of tagsList) {
            const imageWithTag = `${imageToPush}:${tag}`;
            await execute(await getPodmanPath(), [ "rmi", imageWithTag ]);
        }
    }
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

run()
    .catch(core.setFailed)
    .finally(() => {
        if (isImageFromDocker) {
            removeDockerImage();
        }
    });
