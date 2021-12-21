# push-to-registry Changelog

## v2.5.1
- README update

## v2.5
- Allow pushing image manifest.

## v2.4.1
- Fix issue when pushing multiple tags. [#57](https://github.com/redhat-actions/push-to-registry/issues/57)

## v2.4
- Allow fully qualified image names in `tags` input, for compatibility with [docker/metadata-action`](https://github.com/docker/metadata-action). [#50](https://github.com/redhat-actions/push-to-registry/pull/50)
- Fix issue where image pulled from Docker storage would overwrite image in Podman storage [733d8e9](https://github.com/redhat-actions/buildah-build/commit/733d8e9a389084e2f8c441f0a568e5d467497557)

## v2.3.2
- Add the word `local` to the image check messages.
- Add matrix to install latest podman. (Internal)
- Simplify push tests. (Internal)

## v2.3.1
- Fix issue if image is present in docker storage and it's name has '/' in it.
- Fix outputs `registry_path` and `registry_paths` not consisting of image tag.

## v2.3
- Warn users if input `image` and `registry` both has `/` in it's name.
- Update README to better explain inputs `image` and `registry`

## v2.2
- Make input `username` and `password` optional, so that user can skip if they are already logged in to container image registry.

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
