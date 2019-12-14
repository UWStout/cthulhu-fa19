#!/bin/bash

# Customize for specific game
dirName=light-within-the-darkness
pkgName=light-within-the-darkness
webName=Light_Within_the_Darkness

# Move to dir and rename it
cd "./packaged/${dirName}/"
mv win64 "${pkgName}"

# Delete previous archive
rm -f "../${webName}-win64.zip"

# Create archive
zip -r9 "../${webName}-win64.zip" "./${pkgName}"

# Name back and move back
mv "${pkgName}" win64
cd ../..
