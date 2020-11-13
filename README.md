# push-to-registry

Push-to-registry is a GitHub Action for pushing an OCI-compatible image to any registry.

## Action Inputs

<table>
  <thead>
    <tr>
      <th>Action input</th>
      <th>Description</th>
    </tr>
  </thead>

  <tr>
    <td>image-to-push:/td>
    <td>(Required) Name of the image you want to push. Most likely the name you used to create it in the previous step.</td>
  </tr>

  <tr>
    <td>tag</td>
    <td>(Optional) Tag of the image. Default value: latest.</td>
  </tr>

  <tr>
    <td>registry</td>
    <td>(Required) Registry where to push the image. E.g https://quay.io/yourusername/yourrepo</td>
  </tr>

  <tr>
    <td>username</td>
    <td>(Required) Username to use as credential to authenticate to the registry</td>
  </tr>

  <tr>
    <td>password</td>
    <td>(Required) Password to use as credential to authenticate to the registry</td>
  </tr>
</table>


## Contributing

This is an open source project open to anyone. This project welcomes contributions and suggestions!

## Feedback & Questions

If you discover an issue please file a bug in [GitHub issues](https://github.com/redhat-actions/push-to-registry/issues) and we will fix it as soon as possible.

## License

MIT, See [LICENSE](https://github.com/redhat-actions/push-to-registry/blob/main/LICENSE.md) for more information.