rm -rfv dist
mkdir dist
mkdir dist/unpacked
mkdir dist/packed

PKVERSION=$(cat src/manifest.json | jq -r '.version')

echo "Chrome Version is: ${PKVERSION}"
mkdir dist/unpacked/chrome
cp -Rv ./LICENSE ./dist/unpacked/chrome/
cp -Rv ./README.md ./dist/unpacked/chrome/
cp -Rv ./src/* ./dist/unpacked/chrome/
cp -Rv ./chrome/* ./dist/unpacked/chrome/
jq -s '.[0] * .[1]' ./src/manifest.json ./chrome/manifest.json >./dist/unpacked/chrome/manifest.json
zip "dist/packed/chrome.latest.zip" -j ./dist/unpacked/chrome/*
zip "dist/packed/chrome.v${PKVERSION}.zip" -j ./dist/unpacked/chrome/*

echo "Firefox Version is: ${PKVERSION}"
mkdir dist/unpacked/firefox
cp -Rv ./LICENSE ./dist/unpacked/firefox/
cp -Rv ./README.md ./dist/unpacked/firefox/
cp -Rv ./src/* ./dist/unpacked/firefox/
cp -Rv ./firefox/* ./dist/unpacked/firefox/
jq -s '.[0] * .[1]' ./src/manifest.json ./firefox/manifest.json >./dist/unpacked/firefox/manifest.json
zip "dist/packed/firefox.latest.zip" -j ./dist/unpacked/firefox/*
zip "dist/packed/firefox.v${PKVERSION}.zip" -j ./dist/unpacked/firefox/*
