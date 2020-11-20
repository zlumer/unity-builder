#!/usr/bin/env bash

apt install lib32stdc++6 -y

#
# Run steps
#

source /steps/activate.sh
source /steps/build.sh
source /steps/return_license.sh

#
# Exit with code from the build step.
#

exit $BUILD_EXIT_CODE
