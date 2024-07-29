#!/bin/bash

PACKAGES_DIRECTORY="packages/*"
for directory in $PACKAGES_DIRECTORY
do
    # read version from package.json
    VERSION=$(sed 's/.*"version": "\(.*\)".*/\1/;t;d' "$directory/package.json")

    # write version to jsr.jsonc
    sed -i 's/"version": .*"/"version": '\""${VERSION}"\"'/g' "$directory/jsr.jsonc"
done
