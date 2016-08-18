__author__ = 'hsk81'

###############################################################################
###############################################################################

from bottle import Bottle
from notex.api import app_api
from notex.view.debug import app_debug
from notex.view.editor import app_edit
from notex.view.index import app_index
from notex.view.login import app_login
from notex.view.now import app_now
from notex.view.static import app_static

import ARGs
import amd
import gzip
import os
import sass
import rcssmin
import rjsmin

###############################################################################
###############################################################################

app_main = Bottle()
app_main.merge(app_edit)
app_main.merge(app_index)
app_main.merge(app_login)
app_main.merge(app_now)
app_main.merge(app_static)
app_main.mount('/api', app_api)

if ARGs.get('debug'):
    app_main.merge(app_debug)

###############################################################################
###############################################################################

if not ARGs.get('no_sass') or ARGs.get('debug'):
    for path, dns, fns in os.walk('static/css'):
        for filename in filter(lambda fn: fn.endswith('.scss'), fns):
            inp_path = os.path.join(path, filename)
            out_path = inp_path.replace('.scss', '.css')

            with open(out_path, 'w') as out_file:
                out_file.write(sass.compile_file(inp_path))

###############################################################################
###############################################################################

def concat(out_path, inp_path, flag='a', func=lambda s: s):
    with open(inp_path, 'r') as inp_file:
        with open(out_path, flag) as out_file:
            out_file.write(func(inp_file.read()))

def zipify(out_path):
    with open(out_path, 'r') as inp_file:
        with gzip.open(out_path + '.gz', 'wb') as zip_file:
            zip_file.write(inp_file.read())

###############################################################################

if not ARGs.get('no_css_minify') and not ARGs.get('debug'):
    out_path = 'static/build/all.css'

    def minify(out_path, inp_path, flag='a'):
        concat(out_path, inp_path, flag=flag, func=rcssmin.cssmin)

    concat(out_path,
           'static/css/lib/bootstrap/bootstrap-3.3.6.min.css', 'w')
    concat(out_path,
           'static/css/lib/bootstrap/bootstrap-theme-3.3.6.min.css')
    concat(out_path,
           'static/css/lib/highlight/default-9.5.0.min.css')
    concat(out_path,
           'static/js/lib/codemirror/lib/codemirror.css')
    minify(out_path,
           'static/css/app/editor.css')
    zipify(out_path)

###############################################################################

if not ARGs.get('no_js_minify') and not ARGs.get('debug'):
    out_path = 'static/build/all.js'

    def minify(out_path, inp_path, flag='a'):
        concat(out_path, inp_path, flag=flag, func=rjsmin.jsmin)

    def optimy(out_path, inp_path, flag='a'):
        concat(out_path, amd.optimize(inp_path), flag=flag)

    concat(out_path,
           'static/js/lib/jquery/jquery-1.12.1.min.js', 'w')
    concat(out_path,
           'static/js/lib/jquery/jquery.set-cursor-position-1.12.1.min.js')
    concat(out_path,
           'static/js/lib/bootstrap/bootstrap-3.3.6.min.js')
    concat(out_path,
           'static/js/lib/highlight/highlight-9.5.0.min.js')
    concat(out_path,
           'static/js/lib/iscroll/iscroll-5.2.0.min.js')
    concat(out_path,
           'static/js/lib/typo/typo-1.1.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-7.0.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-anchor-2.5.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-abbr-1.0.3.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-center-text-1.0.3.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-decorate-1.2.1.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-emoji-1.2.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-figure-0.3.2.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-footnote-3.0.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-mark-2.0.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-math-4.0.1.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-sub-2.0.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-sup-2.0.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-video-0.4.0.min.js')
    concat(out_path,
           'static/js/lib/codemirror/lib/codemirror.js')
    concat(out_path,
           'static/js/lib/codemirror/addon/selection/active-line.js')
    concat(out_path,
           'static/js/lib/codemirror/addon/display/placeholder.js')
    concat(out_path,
           'static/js/lib/codemirror/addon/mode/multiplex.js')
    concat(out_path,
           'static/js/lib/codemirror/addon/mode/overlay.js')
    concat(out_path,
           'static/js/lib/codemirror/addon/mode/simple.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/clike/clike.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/cmake/cmake.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/css/css.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/dockerfile/dockerfile.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/erlang/erlang.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/fortran/fortran.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/go/go.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/haskell/haskell.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/http/http.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/javascript/javascript.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/jinja2/jinja2.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/julia/julia.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/lua/lua.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/mathematica/mathematica.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/markdown/markdown.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/gfm/gfm.js') ## @aft(markdown)
    concat(out_path,
           'static/js/lib/codemirror/mode/mllike/mllike.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/nginx/nginx.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/octave/octave.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/perl/perl.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/php/php.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/python/python.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/r/r.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/rst/rst.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/sass/sass.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/sql/sql.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/spreadsheet/spreadsheet.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/stex/stex.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/swift/swift.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/xml/xml.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/htmlmixed/htmlmixed.js') ## @aft(xml)
    concat(out_path,
           'static/js/lib/codemirror/mode/yaml/yaml.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/vb/vb.js')
    concat(out_path,
           'static/js/lib/codemirror/mode/vbscript/vbscript.js')
    concat(out_path,
           'static/js/lib/require/require-2.2.0.min.js')

    optimy(out_path, 'amd.json')
    zipify(out_path)

###############################################################################
###############################################################################
