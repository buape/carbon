#!/bin/bash

## FUNCTIONS ##

# Convert a kebab-case string to Title Case
# $1: The kebab-case string
kebab_to_title_case() {
    echo "$1" | sed -e 's/-/ /g' -e 's/\b\(.\)/\u\1/g'
}

# Add meta.json files to the API doc pages that need them
# $1: The API directory
add_meta_files() {
    if [ -d "$1/type-aliases" ]; then
        echo "{ \"title\": \"Type Aliases\" }" >"$1/type-aliases/meta.json"
    fi
}

# Process the subpackage (aka exports) of a package
# $1: The parent package name
# $2: The glob of subpackages
process_subpackage() {
    for dir in $2; do
        local parent_name="$1"
        local this_name="$(basename "$dir")"
        local this_type="$(basename "$(dirname "$dir")")"
        if [ "$this_name" = "*" ]; then continue; fi

        if [ "$this_name" = "index" ]; then
            local name="@buape/$parent_name"
            local title="Core"
            rm -rf "$dir/../index.mdx"
        elif [ "$this_type" = "plugins" ]; then
            local name="@buape/$parent_name/$this_name"
            local title="$(kebab_to_title_case "$this_name")"
        elif [ "$this_type" = "adapters" ]; then
            local name="@buape/$parent_name/adapters/$this_name"
            local title="$(kebab_to_title_case "$this_name")"
        fi

        echo "Processing subpackage $name"
        escaped_name="${name//@/\\@}"
        escaped_name="${escaped_name//\//\\/}"
        sed -i -e "s/title: \(.*\)/title: \"$escaped_name\"/" "$dir/index.mdx"
        sed -i -e "s/## Index/ /" "$dir/index.mdx"
        echo "{ \"title\": \"$title\" }" >"$dir/meta.json"
        add_meta_files "$dir"
    done
}

## MAIN ##

PKG_NAME="carbon"
THIS_DIR="$(dirname "$(realpath "$0")")"
INPUT_DIR="$THIS_DIR/../packages/$PKG_NAME/docs"
OUTPUT_DIR="$THIS_DIR/content/api"

echo "Processing package @buape/$PKG_NAME"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"
cp -r "$INPUT_DIR"/* "$OUTPUT_DIR"

process_subpackage "$PKG_NAME" "$OUTPUT_DIR/index"
process_subpackage "$PKG_NAME" "$OUTPUT_DIR/plugins/*"
process_subpackage "$PKG_NAME" "$OUTPUT_DIR/adapters/*"
add_meta_files "$OUTPUT_DIR"
