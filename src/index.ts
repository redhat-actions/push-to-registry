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
let isPushingDockerImage = false;
let imageToPush: string;

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
    const tag = core.getInput("tag") || "latest";
    const registry = core.getInput("registry", { required: true });
    const username = core.getInput("username", { required: true });
    const password = core.getInput("password", { required: true });
    const tlsVerify = core.getInput("tls-verify");
    const digestFileInput = core.getInput("digestfile");

    imageToPush = `${imageInput}:${tag}`;

    // check if image exist in Podman image storage
    const isPresentInPodman: boolean = await checkImageInPodman(
        imageToPush,
    );

    // check if image exist in Docker image storage and if exist pull the image to Podman
    const isPresentInDocker: boolean = await pullImageFromDocker(
        imageToPush,
    );

    // failing if image is not found in Docker as well as Podman
    if (!isPresentInDocker && !isPresentInPodman) {
        throw new Error(`Image ${imageToPush} not found in Podman local storage, or Docker local storage.`);
    }

    if (isPresentInPodman && isPresentInDocker) {
        const isPodmanImageLatest = await isPodmanLocalImageLatest(
            imageToPush,
        );

        if (!isPodmanImageLatest) {
            core.warning(`The version of ${imageToPush} in the Docker image storage is more recent `
                 + `than the version in the Podman image storage. The image from the Docker image storage `
                 + `will be pushed.`);
            imageToPush = `${dockerBaseUrl}/${imageToPush}`;
            isPushingDockerImage = true;
        }
        else {
            core.warning(`The version of ${imageToPush} in the Podman image storage is more recent `
                + `than the version in the Docker image storage. The image from the Podman image `
                + `storage will be pushed.`);
        }
    }
    else if (isPresentInDocker) {
        imageToPush = `${dockerBaseUrl}/${imageToPush}`;
        core.info(`Image ${imageToPush} was found in the Docker image storage, but not in the Podman `
            + `image storage. The image will be pulled into Podman image storage, pushed, and then `
            + `removed from the Podman image storage.`);
        isPushingDockerImage = true;
    }

    let pushMsg = `Pushing ${imageToPush} to ${registry}`;
    if (username) {
        pushMsg += ` as ${username}`;
    }
    core.info(pushMsg);

    const registryWithoutTrailingSlash = registry.replace(/\/$/, "");
    const registryPath = `${registryWithoutTrailingSlash}/${imageInput}:${tag}`;

    const creds = `${username}:${password}`;

    let digestFile = digestFileInput;
    if (!digestFile) {
        digestFile = `${imageToPush.replace(
            /[/\\/?%*:|"<>]/g,
            "-",
        )}_digest.txt`;
    }

    // push the image
    const args = [
        "push",
        "--quiet",
        "--digestfile",
        digestFile,
        "--creds",
        creds,
        imageToPush,
        registryPath,
    ];

    // check if tls-verify is not set to null
    if (tlsVerify) {
        args.push(`--tls-verify=${tlsVerify}`);
    }

    await execute(await getPodmanPath(), args);

    core.info(`Successfully pushed ${imageToPush} to ${registryPath}.`);
    core.setOutput("registry-path", registryPath);

    try {
        const digest = (await fs.promises.readFile(digestFile)).toString();
        core.info(digest);
        core.setOutput("digest", digest);
    }
    catch (err) {
        core.warning(`Failed to read digest file "${digestFile}": ${err}`);
    }
}

async function pullImageFromDocker(
    imageName: string,
): Promise<boolean> {
    try {
        await execute(await getPodmanPath(), [ "pull", `docker-daemon:${imageName}` ]);
        core.info(`${imageName} found in Docker image storage`);
        return true;
    }
    catch (err) {
        core.info(`${imageName} not found in Docker image storage`);
        return false;
    }
}

async function checkImageInPodman(
    imageName: string,
): Promise<boolean> {
    // check if images exist in Podman's storage
    core.info(`Checking if ${imageName} is in Podman image storage`);
    try {
        await execute(await getPodmanPath(), [ "image", "exists", imageName ]);
        core.info(`Image ${imageName} found in Podman image storage`);
        return true;
    }
    catch (err) {
        core.info(`Image ${imageName} not found in Podman image storage`);
        core.debug(err);
        return false;
    }
}

async function isPodmanLocalImageLatest(
    imageName: string,
): Promise<boolean> {
    // get creation time of the image present in the Podman image storage
    const podmanLocalImageTimeStamp = await execute(await getPodmanPath(), [
        "image",
        "inspect",
        imageName,
        "--format",
        "{{.Created}}",
    ]);

    // get creation time of the image pulled from the Docker image storage
    // appending 'docker.io/library' infront of image name as pulled image name
    // from Docker image storage starts with the 'docker.io/library'
    const pulledImageCreationTimeStamp = await execute(await getPodmanPath(), [
        "image",
        "inspect",
        `${dockerBaseUrl}/${imageName}`,
        "--format",
        "{{.Created}}",
    ]);

    const podmanImageTime = new Date(podmanLocalImageTimeStamp.stdout).getTime();

    const dockerImageTime = new Date(pulledImageCreationTimeStamp.stdout).getTime();

    return podmanImageTime > dockerImageTime;
}

// remove the pulled image from the Podman image storage
async function removeDockerImage(): Promise<void> {
    core.info(`Removing ${imageToPush} from the Podman image storage`);
    await execute(await getPodmanPath(), [ "rmi", imageToPush ]);
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
        if (isPushingDockerImage) {
            removeDockerImage();
        }
    });
