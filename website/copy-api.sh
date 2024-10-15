#!/bin/bash

WEBSITE_DIR="$(dirname "$(realpath "$0")")"
CONTENT_DIR="$WEBSITE_DIR/content"
PACKAGES_DIR="$WEBSITE_DIR/../packages"

# Convert a kebab-case string to Title Case
# $1: The kebab-case string
kebab_to_title_case() {
    echo "$1" | sed -e 's/-/ /g' -e 's/\b\(.\)/\u\1/g'
}

# Copy API docs for each package
# $1: The package directory
copy_api_docs() {
    for dir in $1; do
        local pkg_name="$(basename "$dir")"
        local from_dir="$PACKAGES_DIR/$pkg_name/docs"
        local to_dir="$CONTENT_DIR/$pkg_name/api"

        rm -rf "$to_dir"
        mkdir -p "$to_dir"
        cp -r "$from_dir"/* "$to_dir"
    done
}

# Add meta.json files to the API doc pages that need them
# $1: The API directory
add_meta_files() {
    for dir in $1; do
        if [ -d "$api_dir/type-aliases" ]; then
            echo "{ \"title\": \"Type Aliases\" }" >"$api_dir/type-aliases/meta.json"
        fi
    done
}

# Process the subpackage (aka exports) of a package
# $1: The package name
# $2: The glob of subpackages
process_subpackage() {
    for dir in $2; do
        local pkg_name="$(basename "$dir")"
        local scope_name="$(basename "$(dirname "$dir")")"
        if [ "$pkg_name" = "*" ]; then continue; fi
        echo "Processing subpackage @buape/$1/$pkg_name"

        if [ "$pkg_name" = "index" ]; then
            local name="@buape/$1"
            local title="Core"
            rm -rf "$dir/../index.mdx"
        elif [ "$scope_name" = "plugins" ]; then
            local name="@buape/$1/$pkg_name"
            local title="$(kebab_to_title_case "$pkg_name")"
        elif [ "$scope_name" = "adapters" ]; then
            local name="@buape/$1/adapters\/$pkg_name"
            local title="$(kebab_to_title_case "$pkg_name")"
        fi

        escaped_name=$(echo "$name" | sed 's/@/\\@/g')
        escaped_name=$(echo "$escaped_name" | sed 's/\//\\/g')
        sed -i -e "s/title: \(.*\)/title: \"$escaped_name\"/" "$dir/index.mdx"
        sed -i -e "s/## Index/ /" "$dir/index.mdx"
        echo "{ \"title\": \"$title\" }" >"$dir/meta.json"

        add_meta_files "$dir"
    done
}

# Process a glob of packages
# $1: The glob of packages
process_package() {
    for dir in $1; do
        local pkg_name="$(basename "$dir")"

        echo "Processing package @buape/$pkg_name"
        copy_api_docs "$dir"

        local api_dir="$CONTENT_DIR/$pkg_name/api"
        # Process each of the core subpackages separately
        if [ "$pkg_name" = "carbon" ]; then
            process_subpackage "carbon" "$api_dir/index"
            process_subpackage "carbon" "$api_dir/plugins/*"
            # process_subpackage "carbon" "$api_dir/adapters/*"
        else
            add_meta_files "$api_dir"
        fi
    done
}

process_package "$PACKAGES_DIR/*"
