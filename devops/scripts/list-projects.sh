#!/bin/bash

#
# List projects with the tag 'scodi'
#
# @param 'true' or 'false'. Indicates if affected projects only must be listed
# @return single-line JSON, which partial schema is: { "projects": [{ "id": ""}, { "id": ""}] }
#

ONLY_AFFECTED=$1

if [[ "$ONLY_AFFECTED" == "true" ]]; then
    # https://moonrepo.dev/docs/commands/query/projects#affected-projects
    projects=$(moon query touched-files | moon query projects --affected --tags scodi --json)
elif [[ "$ONLY_AFFECTED" == "false" ]]; then
    # https://moonrepo.dev/docs/commands/query/projects
    projects=$(moon query projects --tags scodi --json)
fi

# remove whitespaces, newlines... https://unix.stackexchange.com/a/32587
echo "$projects"  | tr -d "[:space:]"
