# push-to-registry Changelog

## v2.1.1
- Add output message if input `tags` is not provided
- Modify output message if tag(s) are not found

## v2.1
- Add output `registy-path` to output first element of `registry-paths`
- Print image digest after every push to verify image digest for each tag
- Print `podman version` at start of the action to verify that required version is being used
- (Internal) Add `Link checker` workflow to identify dangling links

## v2
- Rename `tag` input to `tags`, to allow you to push multiple tags of the same image
- Add input `extra_args` to append arbitrary arguments to the `podman push`
- Rename `registry-path` output to `registry-paths`, which is a JSON-parseable array containing all registry paths of the pushed image. The size of the output array is the number of `tags` that were pushed.
- (Internal) Add test workflows to test build and push using multiple container CLIs (Podman and Docker)
- (Internal) Add CI checks to the action that includes ESlint, bundle verifier and IO checker

## v1.2
- Solve issue when image is present in Podman and Docker both

## v1.1
- Add digestfile input and output argument

## v1.0
- Initial marketplace release

## v0.1
- Initial pre-release
