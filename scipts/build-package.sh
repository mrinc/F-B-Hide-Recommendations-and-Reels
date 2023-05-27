#!/bin/bash

if [ -d "lib" ]; then
  echo "LIB dir exists! This is not a clean build env!"
  exit 3
fi

PKVERSION=$(cat src/manifest.json | jq -r '.version')

if [ "$(PKVERSION)" == null ]; then
  echo "Package version not found!"
  exit 3
fi

echo "Compiling source"
zip "dist/source.latest.zip" -r ./*
zip "dist/source.v${PKVERSION}.zip" -r ./*

mkdir dist/unpacked
mkdir dist/packed
mkdir lib
mkdir lib/chrome
mkdir lib/edge
mkdir lib/firefox
npm ci
npx webpack --config webpack.config.popup.js
npx webpack --config webpack.config.content.js
npx webpack --config webpack.config.background.js
find ./src/ -name "*.png" -type f -exec cp -rf '{}' ./lib ';'
find ./src/ -name "*.html" -type f -exec cp -rf '{}' ./lib ';'
find ./src/ -name "*.json" -type f -exec cp -rf '{}' ./lib ';'
find ./src/ -name "*.css" -type f -exec cp -rf '{}' ./lib ';'
find ./src/ -name "*.js" -type f -exec cp -rf '{}' ./lib ';'
find ./src/chrome/ -name "*.*" -type f -exec cp -rf '{}' ./lib/chrome ';'
find ./src/edge/ -name "*.*" -type f -exec cp -rf '{}' ./lib/edge ';'
find ./src/firefox/ -name "*.*" -type f -exec cp -rf '{}' ./lib/firefox ';'

convert lib/logo.png -resize 16x16 lib/logo-16x16.png
convert lib/logo.png -resize 24x24 lib/logo-24x24.png
convert lib/logo.png -resize 32x32 lib/logo-32x32.png
convert lib/logo.png -resize 48x48 lib/logo-48x48.png
convert lib/logo.png -resize 64x64 lib/logo-64x64.png
convert lib/logo.png -resize 96x96 lib/logo-96x96.png
convert lib/logo.png -resize 128x128 lib/logo-128x128.png

if [ "$1" = "chrome" ] || [ -z "$1" ]; then
  echo "Chrome Version is: ${PKVERSION}"
  mkdir dist/unpacked/chrome
  cp -Rv ./LICENSE ./dist/unpacked/chrome/
  cp -Rv ./README.md ./dist/unpacked/chrome/
  cp -Rv ./lib/* ./dist/unpacked/chrome/
  cp -Rv ./lib/chrome/* ./dist/unpacked/chrome/
  jq -s '.[0] * .[1]' ./lib/manifest.json ./lib/chrome/manifest.json >./dist/unpacked/chrome/manifest.json
  zip "dist/packed/chrome.latest.zip" -j ./dist/unpacked/chrome/*
  zip "dist/packed/chrome.v${PKVERSION}.zip" -j ./dist/unpacked/chrome/*
fi

if [ "$1" = "edge" ] || [ -z "$1" ]; then
  echo "Edge Version is: ${PKVERSION}"
  mkdir dist/unpacked/edge
  cp -Rv ./LICENSE ./dist/unpacked/edge/
  cp -Rv ./README.md ./dist/unpacked/edge/
  cp -Rv ./lib/* ./dist/unpacked/edge/
  cp -Rv ./lib/edge/* ./dist/unpacked/edge/
  jq -s '.[0] * .[1]' ./lib/manifest.json ./lib/edge/manifest.json >./dist/unpacked/edge/manifest.json
  zip "dist/packed/edge.latest.zip" -j ./dist/unpacked/edge/*
  zip "dist/packed/edge.v${PKVERSION}.zip" -j ./dist/unpacked/edge/*
fi

if [ "$1" = "firefox" ] || [ -z "$1" ]; then
  echo "Firefox Version is: ${PKVERSION}"
  mkdir dist/unpacked/firefox
  cp -Rv ./LICENSE ./dist/unpacked/firefox/
  cp -Rv ./README.md ./dist/unpacked/firefox/
  cp -Rv ./lib/* ./dist/unpacked/firefox/
  cp -Rv ./lib/firefox/* ./dist/unpacked/firefox/
  jq -s '.[0] * .[1]' ./lib/manifest.json ./lib/firefox/manifest.json >./dist/unpacked/firefox/manifest.json
  jq '{"background": { "scripts": .background[0].scripts } }' ./dist/unpacked/firefox/manifest.json >./dist/unpacked/firefox/manifest-temp.json
  jq 'del(.background)' ./dist/unpacked/firefox/manifest.json >./dist/unpacked/firefox/manifest-temp2.json
  rm ./dist/unpacked/firefox/manifest.json
  jq -s '.[0] * .[1]' ./dist/unpacked/firefox/manifest-temp.json ./dist/unpacked/firefox/manifest-temp2.json >./dist/unpacked/firefox/manifest.json
  rm ./dist/unpacked/firefox/manifest-temp.json
  rm ./dist/unpacked/firefox/manifest-temp2.json
  zip "dist/packed/firefox.latest.zip" -j ./dist/unpacked/firefox/*
  zip "dist/packed/firefox.v${PKVERSION}.zip" -j ./dist/unpacked/firefox/*
fi
