mkdir out;
PKVERSION=$(cat src/manifest.json | jq -r '.version');
echo "Version is: ${PKVERSION}";
PKPUBFILE="out/v${PKVERSION}.zip";
rm $PKPUBFILE
zip $PKPUBFILE -j LICENSE README.md ./src/*