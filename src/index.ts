import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import { CommandResult } from './types';

export async function run(): Promise<void> {
    const imageToPush = core.getInput('image-to-push');
    const quayRegistry = core.getInput('quay-registry');
    const username = core.getInput('username');
    const password = core.getInput('password');

    // get podman cli
    const podman = await io.which('podman', true);    

    // push image
    const push: CommandResult = await execute(podman, ['push', '--creds', `${username}:${password}`, `${imageToPush}`, `${quayRegistry}`]);
    if (push.succeeded === false) {
        return Promise.reject(new Error(push.reason));
    }

}

async function execute(executable: string, args: string[]): Promise<CommandResult> {
    let error = '';
    
    const options: exec.ExecOptions = {};
    options.listeners = {
        stderr: (data: Buffer): void => {
            error += data.toString();
        }
    };
    const exitCode = await exec.exec(executable, args, options);
    if (exitCode === 1) {
        return Promise.resolve({ succeeded: false, error: error });
    } 
    return Promise.resolve({ succeeded: true });
}

run().catch(core.setFailed);