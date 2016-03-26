#!/bin/bash
###############################################################################
SCRIPT_PATH=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd) ;
###############################################################################

function concat_lib_js () {
    cat \
        static/js/lib/jquery/jquery-1.12.1.min.js \
        static/js/lib/jquery/jquery.set-cursor-position-1.12.1.min.js \
        static/js/lib/bootstrap/bootstrap-3.3.6.min.js \
        static/js/lib/highlight/highlight-9.2.0.min.js \
        static/js/lib/markdown-it/markdown-it-6.0.0.min.js \
        static/js/lib/markdown-it/markdown-it-abbr-1.0.3.min.js \
        static/js/lib/markdown-it/markdown-it-anchor-2.5.0.min.js \
        static/js/lib/markdown-it/markdown-it-figure-0.2.3.min.js \
        static/js/lib/markdown-it/markdown-it-footnote-2.0.0.min.js \
        static/js/lib/markdown-it/markdown-it-mark-2.0.0.min.js \
        static/js/lib/markdown-it/markdown-it-math-3.0.2.min.js \
        static/js/lib/markdown-it/markdown-it-sub-1.0.0.min.js \
        static/js/lib/markdown-it/markdown-it-sup-1.0.0.min.js \
      > static/js/lib.js
}
function concat_app_js () {
    cat \
        static/js/app/cookie/cookie.js \
        static/js/app/function/after.js \
        static/js/app/function/assert.js \
        static/js/app/function/before.js \
        static/js/app/function/buffered.js \
        static/js/app/function/mine.js \
        static/js/app/function/partial.js \
        static/js/app/function/random.js \
        static/js/app/function/with.js \
        static/js/app/app.js \
      > static/js/app.js
}
function concat_all_js () {
    concat_lib_js && \
    concat_app_js && \
    cat \
        static/js/lib.js \
        static/js/app.js \
      > static/js/all.js
}

function minify_lib_js () {
    uglifyjs static/js/lib.js -m -c > static/js/lib.min.js && \
    rm static/js/lib.js
}
function minify_app_js () {
    uglifyjs static/js/app.js -m -c > static/js/app.min.js && \
    rm static/js/app.js
}
function minify_all_js () {
    uglifyjs static/js/all.js -m -c > static/js/all.min.js && \
    rm static/js/all.js static/js/app.js static/js/lib.js
}

###############################################################################

function minify_app_css () {
    cleancss --s0 \
        static/css/app/edit.css \
      > static/css/app.min.css
}
function minify_lib_css () {
    cleancss --s0 \
        static/css/lib/bootstrap/bootstrap-3.3.6.min.css \
        static/css/lib/bootstrap/bootstrap-theme-3.3.6.min.css \
        static/css/lib/highlight/default-9.2.0.min.css \
      > static/css/lib.min.css
}
function minify_all_css () {
    minify_app_css && \
    minify_lib_css && \
    cat \
        static/css/lib.min.css \
        static/css/app.min.css \
      > static/css/all.min.css

    rm static/css/app.min.css static/css/lib.min.css
}

###############################################################################
###############################################################################

case ${1} in

    all)
        concat_all_js && \
        minify_all_js && \
        minify_all_css ;;
    js)
        concat_lib_js && \
        minify_lib_js && \
        concat_app_js && \
        minify_app_js ;;
    css)
        minify_lib_css && \
        minify_app_css ;;

    minify-lib-js)
        concat_lib_js && minify_lib_js ;;
    minify-app-js)
        concat_app_js && minify_app_js ;;
    minify-lib-css)
        minify_lib_css ;;
    minify-app-css)
        minify_app_css ;;

    *)
        $0 all ;;
esac

###############################################################################
###############################################################################

exit 0
