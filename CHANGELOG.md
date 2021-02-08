# push-to-registry Changelog

## v2
- Rename `tag` input to `tags`, and allow you to push multiple tags of the same image
- Add input parameter `extra_args` to append extra args to the podman push
- Rename `registry-path` output parameter to `registry-paths`, and allow you to output multiple image registry paths of the pushed image
- (Internal) Add test workflows to test build and push using multiple container CLI (Podman and Docker)
- (Internal) Add CI checks to the action that includes ESlint, bundle verifier and IO checker

## v1.2
- Solve issue when image is present in Podman and Docker both

## v1.1
- Add digestfile input and output argument

## v1.0
- Initial marketplace release

## v0.1
- Initial pre-release