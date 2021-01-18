# push-to-registry

[![Verify Bundle](https://github.com/redhat-actions/push-to-registry/workflows/Verify%20Bundle/badge.svg)](https://github.com/redhat-actions/push-to-registry/actions?query=workflow%3A%22Verify+Bundle%22)
[![tag badge](https://img.shields.io/github/v/tag/redhat-actions/push-to-registry)](https://github.com/redhat-actions/push-to-registry/tags)
[![license badge](https://img.shields.io/github/license/redhat-actions/push-to-registry)](./LICENSE)
[![size badge](https://img.shields.io/github/size/redhat-actions/push-to-registry/dist/index.js)](./dist)

Push-to-registry is a GitHub Action for pushing a container image to an image registry, such as Dockerhub, Quay&#46;io, the GitHub Container Registry, or an OpenShift integrated registry.

This action only runs on Linux, as it uses [podman](https://github.com/containers/Podman) to perform the push. [GitHub's Ubuntu action runners](https://github.com/actions/virtual-environments#available-environments) come with Podman preinstalled. If you are not using those runners, you must first [install Podman](https://podman.io/getting-started/installation).

## Action Inputs

Refer to the [`podman push`](http://docs.podman.io/en/latest/markdown/podman-manifest-push.1.html) documentation for more information.

<table>
  <thead>
    <tr>
      <th>Input</th>
      <th>Required</th>
      <th>Description</th>
    </tr>
  </thead>

  <tr>
    <td>image</td>
    <td>Yes</td>
    <td>
      Name of the image you want to push.
    </td>
  </tr>

  <tr>
    <td>tag</td>
    <td>No</td>
    <td>
      Image tag to push.<br>
      Defaults to <code>latest</code>.
    </td>
  </tr>

  <tr>
    <td>registry</td>
    <td>Yes</td>
    <td>URL of the registry to push the image to.<br>
    Eg. <code>quay.io/&lt;username&gt;</code></td>
  </tr>

  <tr>
    <td>username</td>
    <td>Yes</td>
    <td>Username with which to authenticate to the registry.</td>
  </tr>

  <tr>
    <td>password</td>
    <td>Yes</td>
    <td>Password, encrypted password, or access token with which to authenticate to the registry.</td>
  </tr>

   <tr>
    <td>tls-verify</td>
    <td>No</td>
    <td>Verify TLS certificates when contacting the registry. Set to "false" to skip certificate verification.</td>
  </tr>

  <tr>
    <td>digestfile</td>
    <td>No</td>
    <td>After copying the image, write the digest of the resulting image to the file. By default, the filename will be determined from the image and tag.
    The contents of this file are the <code>digest</code> output.
</table>

## Action Outputs

`registry-path`: The registry path to which the image was pushed.<br>
For example, `quay.io/username/spring-image:v1`.

`digest`: The pushed image digest, as written to the `digestfile`.<br>
For example, `sha256:66ce924069ec4181725d15aa27f34afbaf082f434f448dc07a42daa3305cdab3`.

## Examples

The example below shows how the `push-to-registry` action can be used to push an image created by the [buildah-build](https://github.com/redhat-actions/buildah-build) action.

```yaml
name: Build and Push Image
on: [push]

jobs:
  build:
    name: Build and push image
    runs-on: ubuntu-latest
    env:
      IMAGE_NAME: my-app
      IMAGE_TAG: latest

    steps:
    - uses: actions/checkout@v2

    - name: Build Image
      uses: redhat-actions/buildah-build@v1
      with:
        image: ${{ env.IMAGE_NAME }}
        tag: ${{ env.TAG }}
        dockerfiles: |
          ./Dockerfile

    - name: Push To Quay
      id: push-to-quay
      uses: redhat-actions/push-to-registry@v1
      with:
        image: ${{ env.IMAGE_NAME }}
        tag: ${{ env.TAG }}
        registry: ${{ secrets.QUAY_REPO }}
        username: ${{ secrets.QUAY_USERNAME }}
        password: ${{ secrets.QUAY_TOKEN }}

    - name: Use the image
      run: echo "New image has been pushed to ${{ steps.push-to-quay.outputs.registry-path }}"
```

## Note about images built with Docker

This action uses `Podman` to push, but can also push images built with `Docker`. However, Docker and Podman store their images in different locations, and Podman can only push images in its own storage.

If the image to push is present in the Docker image storage but not in the Podman image storage, it will be pulled into Podman's storage.

If the image to push is present in both the Docker and Podman image storage, the action will push the image which was more recently built, and log a warning.

If an image was pulled from the Docker image storage into the Podman storage, it will be cleaned up from the Podman storage before the action exits.

## Troubleshooting
Note that quay.io repositories are private by default.<br>

This means that if you push an image for the first time, you will have to authenticate before pulling it, or go to the repository's settings and change its visibility.

## Contributing

This is an open source project open to anyone. This project welcomes contributions and suggestions!

## Feedback & Questions

If you discover an issue please file a bug in [GitHub issues](https://github.com/redhat-actions/push-to-registry/issues) and we will fix it as soon as possible.

## License

MIT, See [LICENSE](./LICENSE) for more information.
