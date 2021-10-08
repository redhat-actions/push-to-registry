/***************************************************************************************************
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 **************************************************************************************************/

export function splitByNewline(s: string): string[] {
    return s.split(/\r?\n/);
}

export function isFullImageName(image: string): boolean {
    return image.indexOf(":") > 0;
}

export function getFullImageName(image: string, tag: string): string {
    if (isFullImageName(tag)) {
        return tag;
    }
    return `${image}:${tag}`;
}

const DOCKER_IO = `docker.io`;
const DOCKER_IO_NAMESPACED = DOCKER_IO + `/library`;

export function getFullDockerImageName(image: string): string {
    switch (image.split("/").length) {
    case 1:
        return `${DOCKER_IO_NAMESPACED}/${image}`;
    case 2:
        return `${DOCKER_IO}/${image}`;
    default:
        return image;
    }
}
