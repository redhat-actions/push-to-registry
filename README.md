# push-to-registry

Push-to-registry is a GitHub Action for pushing an OCI-compatible image to an image registry, such as Dockerhub, Quay&#46;io, or an OpenShift integrated registry.

## Action Inputs

<table>
  <thead>
    <tr>
      <th>Input</th>
      <th>Required</th>
      <th>Description</th>
    </tr>
  </thead>

  <tr>
    <td>image-to-push</td>
    <td>Yes</td>
    <td>
      Name of the image you want to push. Most likely the name you used to create the image in the previous step.
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
    Eg. <code>https://quay.io/&lt;username&gt;</code></td>
  </tr>

  <tr>
    <td>username</td>
    <td>Yes</td>
    <td>Username with which to authenticate to the registry.</td>
  </tr>

  <tr>
    <td>password</td>
    <td>Yes</td>
    <td>Password or personal access token with which to authenticate to the registry.</td>
  </tr>
</table>

## Examples

The example below shows how the `push-to-registry` action can be used to push an image created by the [`buildah-action`](https://github.com/redhat-actions/buildah-action) in an early step.

```yaml
name: Build and Push Image
on: [push]

jobs:
  build:
    name: Build image
    runs-on: ubuntu-latest
    env:
      IMAGE_NAME: petclinic
      BUILT_JAR: "target/spring-petclinic-2.3.0.BUILD-SNAPSHOT.jar"

    steps:
    - name: Checkout
      uses: actions/checkout@v2

    - name: Maven
      run: |
        cd ${GITHUB_WORKSPACE}
        mvn package
    - name: Build Image
      uses: redhat-actions/buildah-action@0.0.1
      with:
        new-image-name: ${{ env.IMAGE_NAME }}
        content: |
          ${{ env.BUILT_JAR }}
        entrypoint: |
          java
          -jar
          ${{ env.BUILT_JAR }}
        port: 8080
    - name: Push To Quay
      uses: redhat-actions/push-to-registry@0.0.1
      with:
        image-to-push: ${{ env.IMAGE_NAME }}
        registry: ${{ secrets.QUAY_REPO }}
        username: ${{ secrets.QUAY_USERNAME }}
        password: ${{ secrets.QUAY_TOKEN }}
```

## Contributing

This is an open source project open to anyone. This project welcomes contributions and suggestions!

## Feedback & Questions

If you discover an issue please file a bug in [GitHub issues](https://github.com/redhat-actions/push-to-registry/issues) and we will fix it as soon as possible.

## License

MIT, See [LICENSE](./LICENSE) for more information.
