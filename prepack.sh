#!/usr/bin/env bash

function prepack () {
    mkdir -p "node_modules/$1/dist" ;
    npx browserify "node_modules/$1/index.js" \
        -o "node_modules/$1/dist/$1.js" -s "$2" ;
    npx terser "node_modules/$1/dist/$1.js" \
        -o "node_modules/$1/dist/$1.min.js" ;
}

function trimtop () {
    tail -n +2 \
        "node_modules/$1/dist/$1.min.js" \
      > "node_modules/$1/dist/$1.tmp.js" ;
    mv \
        "node_modules/$1/dist/$1.tmp.js" \
        "node_modules/$1/dist/$1.min.js" ;
}

prepack "markdown-it-decorate" "markdownitDecorate" ;
trimtop "markdown-it-math" ;
prepack "markdown-it-video" "markdownitVideo" ;
