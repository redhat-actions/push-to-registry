import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as fs from "fs";
import * as path from "path";

interface Response {
    exitCode: number;
    stdout: string;
    stderr: string;
}

async function run(): Promise<void> {
    const imageInput = core.getInput("image", { required: true });
    const tag = core.getInput("tag") || "latest";
    const registry = core.getInput("registry", { required: true });
    const username = core.getInput("username", { required: true });
    const password = core.getInput("password", { required: true });
    const tlsVerify = core.getInput("tls-verify");
    const digestFileInput = core.getInput("digestfile");

    // get Podman cli
    const podman = await io.which("podman", true);

    let imageToPush = `${imageInput}:${tag}`;

    // check if image exist in Podman local registry
    const isPresentInPodman: boolean = await checkImageInPodman(
        imageToPush,
        podman,
    );

    // check if image exist in Docker local registry and if exist pull the image to Podman
    const isPresentInDocker: boolean = await pullImageFromDocker(
        imageToPush,
        podman,
    );

    // boolean value to check if pushed image is from Docker local registry
    let isPushingDockerImage = false;

    if (isPresentInPodman && isPresentInDocker) {
        const warningMsg = "Image found in Podman as well as in Docker local registry.";

        let isPodmanImageLatest = false;
        try {
            isPodmanImageLatest = await isPodmanLocalImageLatest(
                imageToPush,
                podman,
            );
        }
        catch (err) {
            core.setFailed(err);
        }

        if (!isPodmanImageLatest) {
            core.warning(`${warningMsg} Using Docker local registry's image as that is built latest`);
            imageToPush = `docker.io/library/${imageToPush}`;
            isPushingDockerImage = true;
        }
        else {
            core.warning(`${warningMsg} Using Podman local registry's image as that is built latest`);
        }
    }
    else if (isPresentInDocker) {
        imageToPush = `docker.io/library/${imageToPush}`;
        isPushingDockerImage = true;
    }

    let pushMsg = `Pushing ${imageToPush} to ${registry}`;
    if (username) {
        pushMsg += ` as ${username}`;
    }
    core.info(pushMsg);

    const registryPath = `${registry.replace(/\/$/, "")}/${imageInput}:${tag}`;

    const creds = `${username}:${password}`;

    let digestFile = digestFileInput;
    if (!digestFile) {
        digestFile = `${imageToPush.replace(
            /[/\\/?%*:|"<>]/g,
            "-",
        )}_digest.txt`;
    }

    // push image
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

    await execute(podman, args);

    core.info(`Successfully pushed ${imageToPush} to ${registryPath}.`);
    core.setOutput("registry-path", registryPath);

    // remove the pulled image from the Podman local registry
    if (isPushingDockerImage) {
        core.info(`Removing ${imageToPush} from the Podman local registry`);
        await execute(podman, [ "rmi", imageToPush ]);
    }

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
    podman: string,
): Promise<boolean> {
    try {
        await execute(podman, [ "pull", `docker-daemon:${imageName}` ]);
        core.info("Image found and sucessfully pulled from Docker local registry");
        return true;
    }
    catch (err) {
        core.info("Image not found in Docker local registry");
        return false;
    }
}

async function checkImageInPodman(
    imageName: string,
    podman: string,
): Promise<boolean> {
    // check if images exist in Podman's local registry
    core.info("Checking image in Podman local registry");
    try {
        await execute(podman, [ "image", "exists", imageName ]);
        core.info("Image found in Podman local registry");
    }
    catch (err) {
        core.info("Image not found in Podman local registry");
        core.debug(err);
        return false;
    }
    return true;
}

async function isPodmanLocalImageLatest(
    imageName: string,
    podman: string,
): Promise<boolean> {
    // get creation time of the image present in the Podman local registry
    const podmanLocalImageTimeStamp = await execute(podman, [
        "image",
        "inspect",
        imageName,
        "--format",
        "{{.Created}}",
    ]);

    // get creation time of the image pulled from the Docker local registry
    // appending 'docker.io/library' infront of image name as pulled image name
    // from Docker local registry starts with the 'docker.io/library'
    const pulledImageCreationTimeStamp = await execute(podman, [
        "image",
        "inspect",
        `docker.io/library/${imageName}`,
        "--format",
        "{{.Created}}",
    ]);

    const podmanImageTime = new Date(podmanLocalImageTimeStamp.stdout).getTime();

    const dockerImageTime = new Date(pulledImageCreationTimeStamp.stdout).getTime();

    return podmanImageTime > dockerImageTime;
}

async function execute(
    executable: string,
    args: string[],
    execOptions: exec.ExecOptions = {},
): Promise<Response> {
    let stdout = "";
    let stderr = "";

    const finalExecOptions = { ...execOptions };
    finalExecOptions.ignoreReturnCode = true; // the return code is processed below

    finalExecOptions.listeners = {
        stdline: (line) => {
            stdout += `${line}\n`;
        },
        errline: (line) => {
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

run().catch(core.setFailed);
