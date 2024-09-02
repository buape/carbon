#!/usr/bin/env bash
# set -euo pipefail

CONTENT_DIR="website/content"
cd ..
for d in packages/*/docs; do
    PKG="$(basename "$(dirname "$d")")"
    API_DIR="$CONTENT_DIR/$PKG/api"
    echo "Copying $PKG to $API_DIR"
    rm -rf "$API_DIR"
    mkdir -p "$API_DIR"
    cp -rv "$d"/* "$API_DIR"
done

find . -type d -name "type-aliases" | xargs -I {} cp -v website/type-aliases.meta.json {}/meta.json