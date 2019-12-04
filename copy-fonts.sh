#!/usr/bin/env bash

octicons_font=node_modules/octicons-webfont/build/octicons.woff
target_dir=resources

mkdir -p $target_dir

Echo Copy Octicons font
cp $octicons_font $target_dir
