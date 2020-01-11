#!/usr/bin/env python
###############################################################################

__author__ = 'hsk81'

###############################################################################
###############################################################################

import amd
import gzip
import os
import rcssmin
import subprocess

###############################################################################
###############################################################################

def concat(tgt_path, src_path, flag='a', func=lambda s: s):

    with open(src_path, 'r') as inp_file:
        with open(tgt_path, flag) as out_file:
            out_file.write(func(inp_file.read()))

def zipify(tgt_path):

    with open(tgt_path, 'rb') as inp_file:
        with gzip.open(tgt_path + '.gz', 'wb') as zip_file:
            zip_file.write(inp_file.read())

###############################################################################

def css_minify(tgt_path):

    def minify(tgt_path, src_path, flag='a'):
        concat(tgt_path, src_path, flag=flag, func=rcssmin.cssmin)

    minify(tgt_path,
        'static/css/app/font.css', 'w')
    minify(tgt_path,
        'static/css/lib/bootstrap/bootstrap-3.3.6.min.css')
    minify(tgt_path,
        'static/css/lib/bootstrap/bootstrap-theme-3.3.6.min.css')
    minify(tgt_path,
        'static/css/lib/highlight/default-9.13.1.min.css')
    minify(tgt_path,
        'static/js/lib/codemirror.lib/codemirror.css')
    minify(tgt_path,
        'static/css/app/editor.css')

    zipify(tgt_path)

def js_minify(tgt_path):
    tmp_path = tgt_path + '.tmp'

    def optimy(tgt_path, amd_conf, flag='a'):
        concat(tgt_path, amd.optimize(amd_conf), flag=flag)

    def minify(tgt_path, src_path):
        subprocess.call(['npx', 'terser', '-cmo', tgt_path, src_path])

    concat(tmp_path,
        'static/js/lib/jquery/jquery-2.2.4.min.js', 'w')
    concat(tmp_path,
        'static/js/lib/jquery/jquery.set-cursor-position-2.2.4.min.js')
    concat(tmp_path,
        'static/js/lib/bootstrap/bootstrap-3.3.6.min.js')
    concat(tmp_path,
        'static/js/lib/highlight/highlight-9.13.1.min.js')
    concat(tmp_path,
        'static/js/lib/iscroll/iscroll-5.2.0.min.js')
    concat(tmp_path,
        'static/js/lib/typo/typo-1.1.0.min.js')
    concat(tmp_path,
        'static/js/lib/codemirror.lib/codemirror.js')
    concat(tmp_path,
        'static/js/lib/codemirror/addon/display/placeholder.js')
    concat(tmp_path,
        'static/js/lib/codemirror/addon/edit/matchbrackets.js')
    concat(tmp_path,
        'static/js/lib/codemirror/addon/mode/multiplex.js')
    concat(tmp_path,
        'static/js/lib/codemirror/addon/mode/overlay.js')
    concat(tmp_path,
        'static/js/lib/codemirror/addon/mode/simple.js')
    concat(tmp_path,
        'static/js/lib/codemirror/addon/search/searchcursor.js')
    concat(tmp_path,
        'static/js/lib/codemirror/addon/selection/active-line.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/clike/clike.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/cmake/cmake.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/css/css.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/dockerfile/dockerfile.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/erlang/erlang.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/fortran/fortran.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/go/go.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/haskell/haskell.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/http/http.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/javascript/javascript.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/jinja2/jinja2.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/julia/julia.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/lua/lua.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/mathematica/mathematica.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/markdown/markdown.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/gfm/gfm.js') ## @aft(markdown)
    concat(tmp_path,
        'static/js/lib/codemirror/mode/mllike/mllike.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/nginx/nginx.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/octave/octave.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/perl/perl.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/php/php.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/python/python.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/r/r.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/rst/rst.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/sass/sass.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/sql/sql.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/spreadsheet/spreadsheet.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/stex/stex.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/swift/swift.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/xml/xml.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/htmlmixed/htmlmixed.js') ## @aft(xml)
    concat(tmp_path,
        'static/js/lib/codemirror/mode/yaml/yaml.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/vb/vb.js')
    concat(tmp_path,
        'static/js/lib/codemirror/mode/vbscript/vbscript.js')
    concat(tmp_path,
        'static/js/lib/require/require-2.3.6.min.js')

    optimy(tmp_path, 'amd.json')
    minify(tgt_path, tmp_path)
    os.remove(tmp_path)
    zipify(tgt_path)

###############################################################################
###############################################################################

if __name__ == '__main__':

    css_minify(
        tgt_path='./static/build/all.css')
    js_minify(
        tgt_path='./static/build/all.js')

###############################################################################
###############################################################################
