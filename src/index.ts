import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import { CommandResult } from './types';

export async function run(): Promise<void> {
    let imageToPush = core.getInput('image-to-push');
    const tag = core.getInput('tag') || 'latest';
    const registry = core.getInput('registry');
    const username = core.getInput('username');
    const password = core.getInput('password');    

    // get podman cli
    const podman = await io.which('podman', true);

    imageToPush = `${imageToPush}:${tag}`;
    //check if images exist in podman's local storage
    const checkImages: CommandResult = await execute(podman, ['images', '--format', 'json']);
    if (checkImages.succeeded === false) {
        return Promise.reject(new Error(checkImages.reason));
    }    
    const parsedCheckImages = JSON.parse(checkImages.output);
    // this is to temporarily solve an issue with the case-sensitive of the property field name. i.e it is Names or names?? 
    const nameKeyMixedCase = parsedCheckImages[0] && Object.keys(parsedCheckImages[0]).find(key => 'names' === key.toLowerCase());
    const imagesFound = parsedCheckImages.
                            filter(image => image[nameKeyMixedCase] && image[nameKeyMixedCase].find(name => name.includes(`${imageToPush}`))).
                            map(image => image[nameKeyMixedCase]);
    if (imagesFound.length === 0) {
        //check inside the docker daemon local storage
        const pullFromDocker: CommandResult = await execute(podman, ['pull', `docker-daemon:${imageToPush}`]);
        if (pullFromDocker.succeeded === false) {
            return Promise.reject(new Error(`Unable to find the image to push`));
        }
    }

    // push image
    const registryUrl = `${registry.replace(/\/$/, '')}/${imageToPush}`;
    const push: CommandResult = await execute(podman, ['push', '--creds', `${username}:${password}`, `${imageToPush}`, `${registryUrl}`]);
    if (push.succeeded === false) {
        return Promise.reject(new Error(push.reason));
    }
}

async function execute(executable: string, args: string[]): Promise<CommandResult> {
    let output = '';
    let error = '';
    
    const options: exec.ExecOptions = {};
    options.listeners = {
        stdout: (data: Buffer): void => {
            output += data.toString();
        },
        stderr: (data: Buffer): void => {
            error += data.toString();
        }
    };
    const exitCode = await exec.exec(executable, args, options);
    if (exitCode === 1) {
        return Promise.resolve({ succeeded: false, error });
    } 
    return Promise.resolve({ succeeded: true, output });
}

run().catch(core.setFailed);