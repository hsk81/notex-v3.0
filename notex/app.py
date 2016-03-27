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
    out_path = 'static/css/all.tmp.css'

    def minify(out_path, inp_path, flag='a'):
        concat(out_path, inp_path, flag=flag, func=rcssmin.cssmin)

    concat(out_path,
           'static/css/lib/bootstrap/bootstrap-3.3.6.min.css', 'w')
    concat(out_path,
           'static/css/lib/bootstrap/bootstrap-theme-3.3.6.min.css')
    concat(out_path,
           'static/css/lib/highlight/default-9.2.0.min.css')
    minify(out_path,
           'static/css/app/edit.css')
    zipify(out_path)

###############################################################################

if not ARGs.get('no_js_minify') and not ARGs.get('debug'):
    out_path = 'static/js/all.tmp.js'

    def minify(out_path, inp_path, flag='a'):
        concat(out_path, inp_path, flag=flag, func=rjsmin.jsmin)

    concat(out_path,
           'static/js/lib/jquery/jquery-1.12.1.min.js', 'w')
    concat(out_path,
           'static/js/lib/jquery/jquery.set-cursor-position-1.12.1.min.js')
    concat(out_path,
           'static/js/lib/bootstrap/bootstrap-3.3.6.min.js')
    concat(out_path,
           'static/js/lib/highlight/highlight-9.2.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-6.0.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-anchor-2.5.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-abbr-1.0.3.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-center-text-1.0.3.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-decorate-1.2.1.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-emoji-1.1.1.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-figure-0.2.3.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-footnote-2.0.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-mark-2.0.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-math-3.0.2.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-sub-1.0.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-sup-1.0.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-table-of-contents-0.2.0.min.js')
    concat(out_path,
           'static/js/lib/markdown-it/markdown-it-video-0.2.1.min.js')
    minify(out_path,
           'static/js/app/cookie/cookie.js')
    minify(out_path,
           'static/js/app/function/after.js')
    minify(out_path,
           'static/js/app/function/assert.js')
    minify(out_path,
           'static/js/app/function/before.js')
    minify(out_path,
           'static/js/app/function/buffered.js')
    minify(out_path,
           'static/js/app/function/mine.js')
    minify(out_path,
           'static/js/app/function/partial.js')
    minify(out_path,
           'static/js/app/function/random.js')
    minify(out_path,
           'static/js/app/function/with.js')
    minify(out_path,
           'static/js/app/app.js')
    zipify(out_path)

###############################################################################
###############################################################################
