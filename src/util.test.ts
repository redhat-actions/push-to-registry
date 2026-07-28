import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getFullDockerImageName } from "./util.ts";

describe("getFullDockerImageName", () => {
    it("qualifies bare image name with docker.io/library", () => {
        assert.equal(getFullDockerImageName("nginx"), "docker.io/library/nginx");
        assert.equal(getFullDockerImageName("ubuntu"), "docker.io/library/ubuntu");
    });

    it("qualifies user/image with docker.io", () => {
        assert.equal(getFullDockerImageName("myuser/myimage"), "docker.io/myuser/myimage");
    });

    it("does not modify three-segment image names", () => {
        assert.equal(
            getFullDockerImageName("quay.io/myuser/myimage"),
            "quay.io/myuser/myimage",
        );
        assert.equal(
            getFullDockerImageName("ghcr.io/owner/repo"),
            "ghcr.io/owner/repo",
        );
    });

    it("preserves AWS ECR image names", () => {
        assert.equal(
            getFullDockerImageName("123456789.dkr.ecr.us-east-1.amazonaws.com/myimage"),
            "123456789.dkr.ecr.us-east-1.amazonaws.com/myimage",
        );
    });

    it("preserves other two-segment registry/image names with dots in host", () => {
        assert.equal(
            getFullDockerImageName("registry.example.com/myimage"),
            "registry.example.com/myimage",
        );
        assert.equal(
            getFullDockerImageName("localhost:5000/myimage"),
            "localhost:5000/myimage",
        );
    });

    it("does not treat amazonaws.com in path segment as a registry", () => {
        assert.equal(
            getFullDockerImageName("myuser/amazonaws.com"),
            "docker.io/myuser/amazonaws.com",
        );
    });
});
