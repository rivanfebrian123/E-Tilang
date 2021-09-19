#! /bin/bash
set -e

SCOUR_APP="scour --enable-viewboxing --enable-id-stripping "
SCOUR_APP+="--enable-comment-stripping --shorten-ids --remove-descriptive-elements "
SCOUR_APP+="--indent=none --strip-xml-space --create-groups"

${SCOUR_APP} -i data/logo.svg -o dist/logo.svg &
${SCOUR_APP} -i data/id.svg -o dist/id.svg &
${SCOUR_APP} -i data/cari.svg -o dist/cari.svg &
${SCOUR_APP} -i data/dompet.svg -o dist/dompet.svg &
${SCOUR_APP} -i data/palu.svg -o dist/palu.svg &
${SCOUR_APP} -i data/uang.svg -o dist/uang.svg &
sassc data/query.scss dist/query.css -t compressed &

python3 -m http.server
