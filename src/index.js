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
    toString: () => `gableroux/unity3d@sha256:02c9488c23edcd3453a731ac9ef0ce53226daeab80870a54f5163192742b8e7c`,
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
