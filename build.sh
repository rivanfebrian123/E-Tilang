#!/bin/bash
set -e

SCOUR_APP="scour --enable-viewboxing --enable-id-stripping "
SCOUR_APP+="--enable-comment-stripping --shorten-ids --remove-descriptive-elements "
SCOUR_APP+="--indent=none --strip-xml-space --create-groups"

${SCOUR_APP} -i src/img/logo.svg -o dist/logo.svg
${SCOUR_APP} -i src/img/id.svg -o dist/id.svg
${SCOUR_APP} -i src/img/cari.svg -o dist/cari.svg
${SCOUR_APP} -i src/img/dompet.svg -o dist/dompet.svg
${SCOUR_APP} -i src/img/palu.svg -o dist/palu.svg
${SCOUR_APP} -i src/img/uang.svg -o dist/uang.svg

slimit -m -t src/main.js > dist/main.js
sassc src/query.scss dist/query.css -t compressed

inkscape src/assets.svg -i app -o dist/ikon-app.png
inkscape src/assets.svg -i tab -o dist/ikon-tab.png
optipng -o7 dist/ikon-app.png
optipng -o7 dist/ikon-tab.png

inkscape src/assets.svg -i pin -o dist/ikon-pin-ori.svg
${SCOUR_APP} -i dist/ikon-pin-ori.svg -o dist/ikon-pin.svg
rm -rf dist/ikon-pin-ori.svg

python3 -m http.server
