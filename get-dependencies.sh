#! /bin/sh
#
# Preferably, to be executed inside a nice virtualenv you have
# already created and activated.
pip install flask
# Make sure you have libjpeg installed. If it's not already installed when
# you install PIL, PIL will not be happy. In that case, go install libjpeg
# then repeat this as "pip install -I PIL".
pip install PIL
# Also, you want dcraw installed on the path. If you download the prebuilt
# Mac OS X package on an x86 Mac, move /usr/bin/dcrawx86 to /usr/bin/dcraw.
