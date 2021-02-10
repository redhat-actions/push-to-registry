# push-to-registry Changelog

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