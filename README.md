# push-to-registry

[![CI checks](https://github.com/redhat-actions/push-to-registry/workflows/CI%20checks/badge.svg)](https://github.com/redhat-actions/push-to-registry/actions?query=workflow%3A%22CI+checks%22)
[![Test Build and Push](https://github.com/redhat-actions/push-to-registry/workflows/Test%20Build%20and%20Push/badge.svg)](https://github.com/redhat-actions/push-to-registry/actions?query=workflow%3A%22Test+Build+and+Push%22)
[![Multiple container CLI build tests](https://github.com/redhat-actions/push-to-registry/workflows/Multiple%20container%20CLI%20build%20tests/badge.svg)](https://github.com/redhat-actions/push-to-registry/actions?query=workflow%3A%22Multiple+container+CLI+build+tests%22)
[![Link checker](https://github.com/redhat-actions/push-to-registry/workflows/Link%20checker/badge.svg)](https://github.com/redhat-actions/push-to-registry/actions?query=workflow%3A%22Link+checker%22)
<br><br>
[![tag badge](https://img.shields.io/github/v/tag/redhat-actions/push-to-registry)](https://github.com/redhat-actions/push-to-registry/tags)
[![license badge](https://img.shields.io/github/license/redhat-actions/push-to-registry)](./LICENSE)
[![size badge](https://img.shields.io/github/size/redhat-actions/push-to-registry/dist/index.js)](./dist)

Push-to-registry is a GitHub Action for pushing a container image to an image registry, such as Dockerhub, quay&#46;io, the GitHub Container Registry, or an OpenShift integrated registry.

This action only runs on Linux, as it uses [podman](https://github.com/containers/Podman) to perform the push. [GitHub's Ubuntu action runners](https://github.com/actions/virtual-environments#available-environments) come with Podman preinstalled. If you are not using those runners, you must first [install Podman](https://podman.io/getting-started/installation).

## Action Inputs

Refer to the [`podman push`](http://docs.podman.io/en/latest/markdown/podman-manifest-push.1.html) documentation for more information.

| Input Name | Description | Default |
| ---------- | ----------- | ------- |
| image	| Name of the image you want to push. | **Required**
| tags | The tag or tags of the image to push. For multiple tags, seperate by a space. For example, `latest ${{ github.sha }}` | `latest`
| registry | URL of the registry to push the image to. Eg. `quay.io/<username>` | **Required**
| username | Username with which to authenticate to the registry. | None
| password | Password, encrypted password, or access token with which to authenticate to the registry. | None
| tls-verify | Verify TLS certificates when contacting the registry. Set to `false` to skip certificate verification. | `true`
| digestfile | After copying the image, write the digest of the resulting image to the file. The contents of this file are the digest output. | Auto determined from image and tag
| extra-args | Extra args to be passed to podman push. Separate arguments by newline. Do not use quotes. | None

## Action Outputs

`digest`: The pushed image digest, as written to the `digestfile`.<br>
For example, `sha256:66ce924069ec4181725d15aa27f34afbaf082f434f448dc07a42daa3305cdab3`.
For multiple tags, the digest is the same.

`registry-paths`: A JSON array of registry paths to which the tag(s) were pushed.<br>
For example, `[ quay.io/username/spring-image:v1, quay.io/username/spring-image:latest ]`.

`registry-path`: The first element of `registry-paths`, as a string.

## Examples

The example below shows how the `push-to-registry` action can be used to push an image created by the **[buildah-build](https://github.com/redhat-actions/buildah-build)** action. **[podman-login](https://github.com/redhat-actions/podman-login)** action is used here to authenticate to quay.io to push the built image.

```yaml
name: Build and Push Image
on: [ push ]

jobs:
  build:
    name: Build and push image
    runs-on: ubuntu-20.04
    env:
      IMAGE_NAME: my-app
      IMAGE_TAGS: latest v1
      REGISTRY_USER: quayuser
      REGISTRY_PASSWORD: ${{ secrets.REGISTRY_PASSWORD }}

    steps:
    - uses: actions/checkout@v2

    - name: Build Image
      id: build-image
      uses: redhat-actions/buildah-build@v2
      with:
        image: ${{ env.IMAGE_NAME }}
        tags: ${{ env.IMAGE_TAGS }}
        base-image: some_image
        dockerfiles: |
          ./Dockerfile

    - name: Log in to quay.io
      uses: redhat-actions/podman-login@v1
      with:
        username: ${{ env.REGISTRY_USER }}
        password: ${{ env.REGISTRY_PASSWORD }}
        registry: quay.io

    - name: Push To quay.io
      id: push-to-quay
      uses: redhat-actions/push-to-registry@v2
      with:
        image: ${{ steps.build-image.outputs.image }}
        tags: ${{ steps.build-image.outputs.tags }}
        registry: ${{ secrets.QUAY_REPO }}

    - name: Use the image
      run: echo "New image has been pushed to ${{ steps.push-to-quay.outputs.registry-paths }}"
```

## Note about images built with Docker

This action uses `Podman` to push, but can also push images built with `Docker`. However, Docker and Podman store their images in different locations, and Podman can only push images in its own storage.

If the image to push is present in the Docker image storage but not in the Podman image storage, it will be pulled into Podman's storage.

If the image to push is present in both the Docker and Podman image storage, the action will push the image which was more recently built, and log a warning.

If the action pulled an image from the Docker image storage into the Podman storage, it will be cleaned up from the Podman storage before the action exits.

## Note about GitHub runners and Podman
We recommend using `runs-on: ubuntu-20.04` since it has a newer version of Podman.

If you are on `ubuntu-18.04` (which is currently aliased to [`ubuntu-latest`](https://github.com/actions/virtual-environments/issues/1816)) your workflow will use an older version of Podman and may encounter issues such as [#26](https://github.com/redhat-actions/push-to-registry/issues/26).

## Troubleshooting
Note that quay.io repositories are private by default.<br>

This means that if you push an image for the first time, you will have to authenticate before pulling it, or go to the repository's settings and change its visibility.
