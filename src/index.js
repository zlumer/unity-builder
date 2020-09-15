import { Action, BuildParameters, Cache, Docker, ImageTag, Kubernetes, Output } from './model';

const core = require('@actions/core');

async function action() {
  Action.checkCompatibility();
  Cache.verify();

  const { dockerfile, workspace, actionFolder } = Action;

  const buildParameters = await BuildParameters.create();
  const baseImage = {
    version: buildParameters.version,
    platform: buildParameters.platform,
    toString: () => `gableroux/unity3d@sha256:8dd3b2433c0cca9f911df431b8fe39926d26ba5aeece5c2d5b2157b0d31a7e18`,
  }
  if (buildParameters.kubeConfig) {
    core.info('Building with Kubernetes');
    await Kubernetes.runBuildJob(buildParameters, new ImageTag(buildParameters));
  } else {
    // Build docker image
    // TODO: No image required (instead use a version published to dockerhub for the action, supply credentials for github cloning)
    const builtImage = await Docker.build({
      path: actionFolder,
      dockerfile,
      baseImage,
      uid: buildParameters.uid,
      gid: buildParameters.gid,
    });
    await Docker.run(builtImage, { workspace, ...buildParameters });
  }
  // Set output
  await Output.setBuildVersion(buildParameters.buildVersion);
}

action().catch((error) => {
  core.setFailed(error.message);
});
