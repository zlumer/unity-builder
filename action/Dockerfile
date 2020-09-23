ARG IMAGE
FROM gableroux/unity3d:2019.2.21f1-android-70-use-ndk-r16b-for-all-images-before-2019-3-0

ARG UNAME=runner
ARG UID=1000
ARG GID=1000

LABEL "com.github.actions.name"="Unity - Builder"
LABEL "com.github.actions.description"="Build Unity projects for different platforms."
LABEL "com.github.actions.icon"="box"
LABEL "com.github.actions.color"="gray-dark"

LABEL "repository"="http://github.com/webbertakken/unity-actions"
LABEL "homepage"="http://github.com/webbertakken/unity-actions"
LABEL "maintainer"="Webber Takken <webber@takken.io>"

RUN bash -c 'mkdir -p /github/{home,workflow,workspace}' && chown $UID:$GID -R /github/
RUN chown $UID:$GID -R /opt/Unity/
RUN echo "uid: $UID, gid: $GID"
RUN getent group $GID || groupadd -g $GID $UNAME
RUN id -u $UID &>/dev/null || useradd -m -u $UID -g $GID -s /bin/bash -d /github/home $UNAME

# RUN ls -Rla /opt/Unity/Editor/Data/PlaybackEngines/AndroidPlayer
# RUN chmod -R +x /opt/Unity/Editor/Data/PlaybackEngines/AndroidPlayer

ADD default-build-script /UnityBuilderAction
ADD steps /steps
RUN chmod -R +x /steps
ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

USER $UID:$GID
