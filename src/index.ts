import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as fs from "fs";
import * as path from "path";

export async function run(): Promise<void> {
    const imageInput = core.getInput('image', { required: true });
    const tag = core.getInput('tag') || 'latest';
    const registry = core.getInput('registry', { required: true });
    const username = core.getInput('username', { required: true });
    const password = core.getInput('password', { required: true });
    const tlsVerify = core.getInput('tls-verify');
    const digestFileInput = core.getInput('digestfile');

    // get podman cli
    const podman = await io.which('podman', true);

    const imageToPush = `${imageInput}:${tag}`;
    let pushMsg = `Pushing ${imageToPush} to ${registry}`;
    if (username) {
        pushMsg += ` as ${username}`;
    }
    core.info(pushMsg);

    //check if images exist in podman's local storage
    const checkImages = await execute(podman, ['images', '--format', 'json']);

    const parsedCheckImages = JSON.parse(checkImages.stdout);

    // this is to temporarily solve an issue with the case-sensitive of the property field name. i.e it is Names or names??
    const nameKeyMixedCase = parsedCheckImages[0] && Object.keys(parsedCheckImages[0]).find(key => 'names' === key.toLowerCase());
    const imagesFound = parsedCheckImages.
                            filter((image: string) => image[nameKeyMixedCase] && image[nameKeyMixedCase].find((name: string) => name.includes(`${imageToPush}`))).
                            map((image: string ) => image[nameKeyMixedCase]);

    if (imagesFound.length === 0) {
        //check inside the docker daemon local storage
        await execute(podman, [ 'pull', `docker-daemon:${imageToPush}` ]);
    }

    // push image
    const registryPath = `${registry.replace(/\/$/, '')}/${imageToPush}`;

    const creds: string = `${username}:${password}`;

    const digestFile = digestFileInput || `${imageToPush.replace(":", "_")}_digest.txt`;

    const args = [ 'push',
        '--quiet',
        '--digestfile', digestFile,
        '--creds', creds,
        imageToPush,
        registryPath
    ];

    // check if tls-verify is not set to null
    if (tlsVerify) {
        args.push(`--tls-verify=${tlsVerify}`);
    }

    await execute(podman, args);

    core.info(`Successfully pushed ${imageToPush} to ${registryPath}.`);
    core.setOutput('registry-path', registryPath);

    try {
        const digest = (await fs.promises.readFile(digestFile)).toString();
        core.info(digest);
        core.setOutput('digest', digest);
    }
    catch (err) {
        core.warning(`Failed to read digest file "${digestFile}": ${err}`);
    }
}

async function execute(executable: string, args: string[], execOptions: exec.ExecOptions = {}): Promise<{ exitCode: number, stdout: string, stderr: string }> {
    let stdout = "";
    let stderr = "";

    const finalExecOptions = { ...execOptions };
    finalExecOptions.ignoreReturnCode = true;     // the return code is processed below

    finalExecOptions.listeners = {
        stdline: (line) => {
            stdout += line + "\n";
        },
        errline: (line) => {
            stderr += line + "\n"
        },
    }

    const exitCode = await exec.exec(executable, args, finalExecOptions);

    if (execOptions.ignoreReturnCode !== true && exitCode !== 0) {
        // Throwing the stderr as part of the Error makes the stderr show up in the action outline, which saves some clicking when debugging.
        let error = `${path.basename(executable)} exited with code ${exitCode}`;
        if (stderr) {
            error += `\n${stderr}`;
        }
        throw new Error(error);
    }

    return {
        exitCode, stdout, stderr
    };
}

run().catch(core.setFailed);
