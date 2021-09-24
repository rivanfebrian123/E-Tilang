#! /bin/bash
set -e

SCOUR_APP="scour --enable-viewboxing --enable-id-stripping "
SCOUR_APP+="--enable-comment-stripping --shorten-ids --remove-descriptive-elements "
SCOUR_APP+="--indent=none --strip-xml-space --create-groups"

# ${SCOUR_APP} -i src/img/logo.svg -o dist/logo.svg
# ${SCOUR_APP} -i src/img/id.svg -o dist/id.svg
# ${SCOUR_APP} -i src/img/cari.svg -o dist/cari.svg
# ${SCOUR_APP} -i src/img/dompet.svg -o dist/dompet.svg
# ${SCOUR_APP} -i src/img/palu.svg -o dist/palu.svg
# ${SCOUR_APP} -i src/img/uang.svg -o dist/uang.svg
slimit src/main.js -m -t > dist/main.js
sassc src/query.scss dist/query.css -t compressed

python3 -m http.server
