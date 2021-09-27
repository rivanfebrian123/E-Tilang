#!/bin/bash
set -e

SCOUR="scour --enable-viewboxing --enable-id-stripping "
SCOUR+="--enable-comment-stripping --shorten-ids --remove-descriptive-elements "
SCOUR+="--indent=none --strip-xml-space --create-groups"
SASSC="sassc -t compressed --omit-map-comment"

# ${SCOUR} -i src/img/logo.svg -o dist/logo.svg
# ${SCOUR} -i src/img/id.svg -o dist/id.svg
# ${SCOUR} -i src/img/cari.svg -o dist/cari.svg
# ${SCOUR} -i src/img/dompet.svg -o dist/dompet.svg
# ${SCOUR} -i src/img/palu.svg -o dist/palu.svg
# ${SCOUR} -i src/img/uang.svg -o dist/uang.svg

# inkscape src/assets.svg -i app -o dist/ikon-app.png
# inkscape src/assets.svg -i tab -o dist/ikon-tab.png
# optipng -o7 dist/ikon-app.png
# optipng -o7 dist/ikon-tab.png

# inkscape src/assets.svg -i pin -o dist/ikon-pin-ori.svg
# ${SCOUR} -i dist/ikon-pin-ori.svg -o dist/ikon-pin.svg
# rm -rf dist/ikon-pin-ori.svg

# slimit -m -t src/main.js > dist/main.js
${SASSC} src/query.scss dist/query.css

python3 -m http.server
