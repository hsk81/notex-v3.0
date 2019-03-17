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

if ARGs.debug():
    app_main.merge(app_debug)

###############################################################################
###############################################################################

if not ARGs.get('NO_SASS') or ARGs.debug():
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

if not ARGs.get('NO_CSS_MINIFY') and not ARGs.debug():
    out_path = 'static/build/all.css'

    def minify(out_path, inp_path, flag='a'):
        concat(out_path, inp_path, flag=flag, func=rcssmin.cssmin)

    minify(out_path,
           'static/css/lib/bootstrap/bootstrap-3.3.6.min.css', 'w')
    minify(out_path,
           'static/css/lib/bootstrap/bootstrap-theme-3.3.6.min.css')
    minify(out_path,
           'static/css/lib/highlight/default-9.13.1.min.css')
    minify(out_path,
           'static/js/lib/codemirror.lib/codemirror.css')
    minify(out_path,
           'static/css/app/editor.css')
    zipify(out_path)

###############################################################################

if not ARGs.get('NO_JS_MINIFY') and not ARGs.debug():
    out_path = 'static/build/all.js'

    def minify(out_path, inp_path, flag='a'):
        concat(out_path, inp_path, flag=flag, func=rjsmin.jsmin)

    def optimy(out_path, inp_path, flag='a'):
        concat(out_path, amd.optimize(inp_path), flag=flag)

    minify(out_path,
           'static/js/lib/jquery/jquery-2.2.4.min.js', 'w')
    minify(out_path,
           'static/js/lib/jquery/jquery.set-cursor-position-2.2.4.min.js')
    minify(out_path,
           'static/js/lib/bootstrap/bootstrap-3.3.6.min.js')
    minify(out_path,
           'static/js/lib/highlight/highlight-9.13.1.min.js')
    minify(out_path,
           'static/js/lib/iscroll/iscroll-5.2.0.min.js')
    minify(out_path,
           'static/js/lib/typo/typo-1.1.0.min.js')
    minify(out_path,
           'node_modules/markdown-it/dist/markdown-it.min.js')
    minify(out_path,
           'static/js/lib/markdown-it/markdown-it-anchor-2.5.0.min.js')
    minify(out_path,
           'node_modules/markdown-it-abbr/dist/markdown-it-abbr.min.js')
    minify(out_path,
           'static/js/lib/markdown-it/markdown-it-decorate-1.2.1.min.js')
    minify(out_path,
           'node_modules/markdown-it-emoji/dist/markdown-it-emoji.min.js')
    minify(out_path,
           'static/js/lib/markdown-it/markdown-it-figure-0.3.2.min.js')
    minify(out_path,
           'node_modules/markdown-it-footnote/dist/markdown-it-footnote.min.js')
    minify(out_path,
           'node_modules/markdown-it-mark/dist/markdown-it-mark.min.js')
    minify(out_path,
           'static/js/lib/markdown-it/markdown-it-math-4.0.1.min.js')
    minify(out_path,
           'static/js/lib/markdown-it/markdown-it-sub-2.0.0.min.js')
    minify(out_path,
           'static/js/lib/markdown-it/markdown-it-sup-2.0.0.min.js')
    minify(out_path,
           'static/js/lib/markdown-it/markdown-it-video-0.4.0.min.js')
    minify(out_path,
           'static/js/lib/codemirror.lib/codemirror.js')
    minify(out_path,
           'static/js/lib/codemirror/addon/display/placeholder.js')
    minify(out_path,
           'static/js/lib/codemirror/addon/edit/matchbrackets.js')
    minify(out_path,
           'static/js/lib/codemirror/addon/mode/multiplex.js')
    minify(out_path,
           'static/js/lib/codemirror/addon/mode/overlay.js')
    minify(out_path,
           'static/js/lib/codemirror/addon/mode/simple.js')
    minify(out_path,
           'static/js/lib/codemirror/addon/search/searchcursor.js')
    minify(out_path,
           'static/js/lib/codemirror/addon/selection/active-line.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/clike/clike.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/cmake/cmake.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/css/css.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/dockerfile/dockerfile.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/erlang/erlang.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/fortran/fortran.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/go/go.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/haskell/haskell.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/http/http.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/javascript/javascript.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/jinja2/jinja2.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/julia/julia.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/lua/lua.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/mathematica/mathematica.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/markdown/markdown.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/gfm/gfm.js') ## @aft(markdown)
    minify(out_path,
           'static/js/lib/codemirror/mode/mllike/mllike.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/nginx/nginx.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/octave/octave.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/perl/perl.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/php/php.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/python/python.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/r/r.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/rst/rst.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/sass/sass.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/sql/sql.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/spreadsheet/spreadsheet.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/stex/stex.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/swift/swift.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/xml/xml.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/htmlmixed/htmlmixed.js') ## @aft(xml)
    minify(out_path,
           'static/js/lib/codemirror/mode/yaml/yaml.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/vb/vb.js')
    minify(out_path,
           'static/js/lib/codemirror/mode/vbscript/vbscript.js')
    minify(out_path,
           'static/js/lib/require/require-2.3.6.min.js')

    optimy(out_path, 'amd.json')
    zipify(out_path)

###############################################################################
###############################################################################
