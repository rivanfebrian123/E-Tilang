#! /bin/bash
set -e

SCOUR_APP="scour --enable-viewboxing --enable-id-stripping "
SCOUR_APP+="--enable-comment-stripping --shorten-ids --remove-descriptive-elements "
SCOUR_APP+="--indent=none --strip-xml-space --create-groups"

# ${SCOUR_APP} -i src/logo.svg -o dist/logo.svg
# ${SCOUR_APP} -i src/id.svg -o dist/id.svg
# ${SCOUR_APP} -i src/cari.svg -o dist/cari.svg
# ${SCOUR_APP} -i src/dompet.svg -o dist/dompet.svg
# ${SCOUR_APP} -i src/palu.svg -o dist/palu.svg
# ${SCOUR_APP} -i src/uang.svg -o dist/uang.svg
sassc src/query.scss dist/query.css -t compressed

python3 -m http.server
