#!/bin/bash

rm -rfv dist
rm -rfv lib
rm -rfv release
mkdir release
mkdir release/unzip
mkdir release/src
mkdir release/lib
mkdir release/unpacked
mkdir release/packed

PKVERSION=$1

rm v${PKVERSION}.zip
wget https://github.com/mrinc/Facebook-Hide-Recommendations-and-Reels/archive/refs/tags/v${PKVERSION}.zip
unzip v${PKVERSION}.zip -d ./release/unzip
SRC_DIR=./release/unzip/Facebook-Hide-Recommendations-and-Reels-${PKVERSION}/src/
cp -r ./release/unzip/Facebook-Hide-Recommendations-and-Reels-${PKVERSION}/* ./release/
cp ${SRC_DIR}* ./release/src/
mv v${PKVERSION}.zip ./release/packed/source-v${PKVERSION}.zip

pushd ./release/
npm ci
npx webpack --config webpack.config.popup.js
npx webpack --config webpack.config.content.js
npx webpack --config webpack.config.background.js
popd
find ${SRC_DIR} -name "*.png" -type f -exec cp -rf '{}' ./release/lib ';'
find ${SRC_DIR} -name "*.html" -type f -exec cp -rf '{}' ./release/lib ';'
find ${SRC_DIR} -name "*.json" -type f -exec cp -rf '{}' ./release/lib ';'
find ${SRC_DIR} -name "*.css" -type f -exec cp -rf '{}' ./release/lib ';'
find ${SRC_DIR} -name "*.js" -type f -exec cp -rf '{}' ./release/lib ';'

if [ "$2" = "chrome" ] || [ -z "$2" ]; then
  echo "Chrome Version is: ${PKVERSION}"
  mkdir release/unpacked/chrome
  cp -Rv ./release/LICENSE ./release/unpacked/chrome/
  cp -Rv ./release/README.md ./release/unpacked/chrome/
  cp -Rv ./release/lib/* ./release/unpacked/chrome/
  cp -Rv ./release/chrome/* ./release/unpacked/chrome/
  jq -s '.[0] * .[1]' ./release/lib/manifest.json ./release/chrome/manifest.json >./release/unpacked/chrome/manifest.json
  zip "release/packed/chrome.latest.zip" -j ./release/unpacked/chrome/*
  zip "release/packed/chrome.v${PKVERSION}.zip" -j ./release/unpacked/chrome/*
fi

if [ "$2" = "edge" ] || [ -z "$2" ]; then
  echo "Edge Version is: ${PKVERSION}"
  mkdir release/unpacked/edge
  cp -Rv ./release/LICENSE ./release/unpacked/edge/
  cp -Rv ./release/README.md ./release/unpacked/edge/
  cp -Rv ./release/lib/* ./release/unpacked/edge/
  cp -Rv ./release/edge/* ./release/unpacked/edge/
  jq -s '.[0] * .[1]' ./release/lib/manifest.json ./release/edge/manifest.json >./release/unpacked/edge/manifest.json
  zip "release/packed/edge.latest.zip" -j ./release/unpacked/edge/*
  zip "release/packed/edge.v${PKVERSION}.zip" -j ./release/unpacked/edge/*
fi

if [ "$2" = "firefox" ] || [ -z "$2" ]; then
  echo "Firefox Version is: ${PKVERSION}"
  mkdir release/unpacked/firefox
  cp -Rv ./release/LICENSE ./release/unpacked/firefox/
  cp -Rv ./release/README.md ./release/unpacked/firefox/
  cp -Rv ./release/lib/* ./release/unpacked/firefox/
  cp -Rv ./release/firefox/* ./release/unpacked/firefox/
  jq -s '.[0] * .[1]' ./release/lib/manifest.json ./release/firefox/manifest.json >./release/unpacked/firefox/manifest.json
  jq '{"background": { "scripts": .background[0].scripts } }' ./release/unpacked/firefox/manifest.json >./release/unpacked/firefox/manifest-temp.json
  jq 'del(.background)' ./release/unpacked/firefox/manifest.json >./release/unpacked/firefox/manifest-temp2.json
  rm ./release/unpacked/firefox/manifest.json
  jq -s '.[0] * .[1]' ./release/unpacked/firefox/manifest-temp.json ./release/unpacked/firefox/manifest-temp2.json >./release/unpacked/firefox/manifest.json
  rm ./release/unpacked/firefox/manifest-temp.json
  rm ./release/unpacked/firefox/manifest-temp2.json
  zip "release/packed/firefox.latest.zip" -j ./release/unpacked/firefox/*
  zip "release/packed/firefox.v${PKVERSION}.zip" -j ./release/unpacked/firefox/*
fi

rm -rfv release/unzip