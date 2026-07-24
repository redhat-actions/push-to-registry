# push-to-registry Changelog

## v3.0.0

### Breaking Changes
- Upgrade action runtime from Node 20 to Node 24. [#113](https://github.com/redhat-actions/push-to-registry/pull/113)
- Tags are no longer lowercased. Per the OCI distribution spec, only image names and registries are normalized to lowercase; tag case is now preserved. [#112](https://github.com/redhat-actions/push-to-registry/issues/112), [#121](https://github.com/redhat-actions/push-to-registry/pull/121)

### Features
- Add Sigstore signing support via `sigstore-private-key` and `sign-passphrase` inputs. [#120](https://github.com/redhat-actions/push-to-registry/pull/120)
- Add `podman-args` input for global podman flags (e.g. `--storage-driver=vfs`) that apply to all podman invocations, not just push. [#102](https://github.com/redhat-actions/push-to-registry/issues/102), [#121](https://github.com/redhat-actions/push-to-registry/pull/121)
- Add `remote` input for podman remote mode (`--remote`). When enabled, Docker image storage checks are skipped. [#95](https://github.com/redhat-actions/push-to-registry/issues/95), [#122](https://github.com/redhat-actions/push-to-registry/pull/122)

### Bug Fixes
- Prefix unqualified source images with `localhost/` when pushing to prevent podman from resolving to remote registries. [#66](https://github.com/redhat-actions/push-to-registry/issues/66), [#121](https://github.com/redhat-actions/push-to-registry/pull/121)
- Fix default tag fallback when `tags` input is empty. [#109](https://github.com/redhat-actions/push-to-registry/pull/109)
- Fix registry input not being lowercased for OCI compliance. [#110](https://github.com/redhat-actions/push-to-registry/pull/110)
- Fix deprecated `fs.rmdir` usage, replace with `fs.rm`. [#113](https://github.com/redhat-actions/push-to-registry/pull/113)
- Fix typo in `createDockerPodmanImageStorage` function name. [#113](https://github.com/redhat-actions/push-to-registry/pull/113)

### Dependency Updates
- Upgrade `@actions/core` from 1.x to 3.x. [#113](https://github.com/redhat-actions/push-to-registry/pull/113)
- Upgrade `@actions/exec` from 1.x to 3.x. [#113](https://github.com/redhat-actions/push-to-registry/pull/113)
- Upgrade `@actions/io` from 1.x to 3.x. [#113](https://github.com/redhat-actions/push-to-registry/pull/113)
- Upgrade TypeScript from 5.3 to 6.0. [#113](https://github.com/redhat-actions/push-to-registry/pull/113)
- Migrate ESLint from v8 to v10 with flat config. [#113](https://github.com/redhat-actions/push-to-registry/pull/113)
- Bump `ini` from 5.0.0 to 7.0.0. [#118](https://github.com/redhat-actions/push-to-registry/pull/118)

### CI & Infrastructure
- Modernize all CI workflows: update to `ubuntu-24.04`, latest action versions, add permissions and concurrency groups. [#114](https://github.com/redhat-actions/push-to-registry/pull/114)
- Enable secret scanning and push protection. [#114](https://github.com/redhat-actions/push-to-registry/pull/114)
- Add Dependabot configuration for npm and GitHub Actions. [#114](https://github.com/redhat-actions/push-to-registry/pull/114)
- Add CODEOWNERS and SECURITY.md. [#114](https://github.com/redhat-actions/push-to-registry/pull/114)

### Documentation
- Add Required Permissions section to README. [#107](https://github.com/redhat-actions/push-to-registry/issues/107), [#121](https://github.com/redhat-actions/push-to-registry/pull/121)
- Document multi-line tag support using YAML pipe syntax. [#101](https://github.com/redhat-actions/push-to-registry/issues/101), [#121](https://github.com/redhat-actions/push-to-registry/pull/121)
- Add qemu version guidance for multi-arch manifest builds. [#85](https://github.com/redhat-actions/push-to-registry/issues/85), [#121](https://github.com/redhat-actions/push-to-registry/pull/121)
- Document podman remote mode usage. [#122](https://github.com/redhat-actions/push-to-registry/pull/122)

## v2.8
- Update action to run on Node20. https://github.blog/changelog/2023-09-22-github-actions-transitioning-from-node-16-to-node-20/

## v2.7.1
- Don't add docker.io prefix to ECR images. [#69](https://github.com/redhat-actions/push-to-registry/pull/69)

## v2.7
- Update action to run on Node16. https://github.blog/changelog/2022-05-20-actions-can-now-run-in-a-node-js-16-runtime/

## v2.6
- Make image and tag in lowercase, if found in uppercase. https://github.com/redhat-actions/push-to-registry/issues/54
- Remove kubic packages from the test workflows. https://github.com/redhat-actions/buildah-build/issues/93

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
