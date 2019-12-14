#!/bin/bash
dirName=light-within-the-darkness
pkgName=light-within-the-darkness
webName=Light_Within_the_Darkness

# Since create-dmg does not override, be sure to delete previous DMG
rm -f "packaged/${webName}-macOS.dmg"

# Create the DMG
create-dmg \
  --volname "${pkgName}" \
  --volicon "assets/images/icon.icns" \
  --background "../background.png" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "${dirName}.app" 170 190 \
  --hide-extension "${dirName}.app" \
  --app-drop-link 633 185 \
  "packaged/${webName}-macOS.dmg" \
  "packaged/${dirName}/osx64/${dirName}.app"
