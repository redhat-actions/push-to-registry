import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as fs from "fs";
import * as path from "path";

interface ExecResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}

let podmanPath: string | undefined;

// boolean value to check if pushed image is from Docker image storage
let isImageFromDocker = false;
let imageToPush: string;
let tagsList: string[];

async function getPodmanPath(): Promise<string> {
    if (podmanPath == null) {
        podmanPath = await io.which("podman", true);
    }

    return podmanPath;
}

// base URL that gets appended if image is pulled from the Docker imaege storage
const dockerBaseUrl = "docker.io/library";

async function run(): Promise<void> {
    const imageInput = core.getInput("image", { required: true });
    const tags = core.getInput("tags");
    // split tags
    tagsList = tags.split(" ");
    const registry = core.getInput("registry", { required: true });
    const username = core.getInput("username", { required: true });
    const password = core.getInput("password", { required: true });
    const tlsVerify = core.getInput("tls-verify");
    const digestFileInput = core.getInput("digestfile");

    imageToPush = `${imageInput}`;
    const registryPathList: string[] = [];

    // check if image with all the required tags exist in Podman image storage
    const isPresentInPodman: boolean = await checkImageInPodman();

    // check if image with all the required tags exist in Docker image storage
    // and if exist pull the image with all the tags to Podman
    const isPresentInDocker: boolean = await pullImageFromDocker();

    // failing if image with any of the tag is not found in Docker as well as Podman
    if (!isPresentInDocker && !isPresentInPodman) {
        throw new Error(`All the tags of ${imageToPush} not found in Podman local storage, or Docker local storage.`);
    }

    if (isPresentInPodman && isPresentInDocker) {
        const isPodmanImageLatest = await isPodmanLocalImageLatest();
        if (!isPodmanImageLatest) {
            core.warning(`The version of ${imageToPush} in the Docker image storage is more recent `
                 + `than the version in the Podman image storage. The image from the Docker image storage `
                 + `will be pushed.`);
            imageToPush = `${dockerBaseUrl}/${imageToPush}`;
            isImageFromDocker = true;
        }
        else {
            core.warning(`The version of ${imageToPush} in the Podman image storage is more recent `
                + `than the version in the Docker image storage. Tag(s) of the image from the Podman image `
                + `storage will be pushed.`);
        }
    }
    else if (isPresentInDocker) {
        imageToPush = `${dockerBaseUrl}/${imageToPush}`;
        core.info(`${imageToPush} was found in the Docker image storage, but not in the Podman `
            + `image storage. Tag(s) of the image will be pulled into Podman image storage, pushed, and then `
            + `removed from the Podman image storage.`);
        isImageFromDocker = true;
    }

    let pushMsg = `Pushing ${imageToPush} with tags ${tagsList.toString()} to ${registry}`;
    if (username) {
        pushMsg += ` as ${username}`;
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

        // check if tls-verify is not set to null
        if (tlsVerify) {
            args.push(`--tls-verify=${tlsVerify}`);
        }

        await execute(await getPodmanPath(), args);
        core.info(`Successfully pushed ${imageWithTag} to ${registryPath}.`);

        registryPathList.push(registryPath);
    }

    try {
        const digest = (await fs.promises.readFile(digestFile)).toString();
        core.info(digest);
        core.setOutput("digest", digest);
    }
    catch (err) {
        core.warning(`Failed to read digest file "${digestFile}": ${err}`);
    }

    core.setOutput("registry-paths", registryPathList.toString());
}

async function pullImageFromDocker(): Promise<boolean> {
    let imageWithTag;
    try {
        for (const tag of tagsList) {
            imageWithTag = `${imageToPush}:${tag}`;
            await execute(await getPodmanPath(), [ "pull", `docker-daemon:${imageWithTag}` ]);
            core.info(`${imageWithTag} found in Docker image storage`);
        }
    }
    catch (err) {
        core.info(`${imageWithTag} not found in Docker image storage`);
        return false;
    }

    return true;
}

async function checkImageInPodman(): Promise<boolean> {
    // check if images exist in Podman's storage
    core.info(`Checking if ${imageToPush} with tag(s) ${tagsList.toString()} is present in Podman image storage`);
    let imageWithTag;
    try {
        for (const tag of tagsList) {
            imageWithTag = `${imageToPush}:${tag}`;
            await execute(await getPodmanPath(), [ "image", "exists", imageWithTag ]);
            core.info(`${imageWithTag} found in Podman image storage`);
        }
    }
    catch (err) {
        core.info(`${imageWithTag} not found in Podman image storage`);
        core.debug(err);
        return false;
    }

    return true;
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
        for (const tag of tagsList) {
            const imageWithTag = `${imageToPush}:${tag}`;
            await execute(await getPodmanPath(), [ "rmi", imageWithTag ]);
            core.info(`Removing ${imageWithTag} from the Podman image storage`);
        }
    }
}

async function execute(
    executable: string,
    args: string[],
    execOptions: exec.ExecOptions = {},
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

run()
    .catch(core.setFailed)
    .finally(() => {
        if (isImageFromDocker) {
            removeDockerImage();
        }
    });
