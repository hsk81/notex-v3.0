__author__ = 'hsk81'

###############################################################################
###############################################################################

from bottle import Bottle

from notex.api import app_api
from notex.view.debug import app_debug
from notex.view.edit import app_edit
from notex.view.index import app_index
from notex.view.login import app_login
from notex.view.now import app_now
from notex.view.static import app_static

import ARGs, os, sass
import csscompressor as cc

###############################################################################
###############################################################################

app_main = Bottle ()
app_main.merge (app_edit)
app_main.merge (app_index)
app_main.merge (app_login)
app_main.merge (app_now)
app_main.merge (app_static)
app_main.mount ('/api', app_api)

if ARGs.get ('debug'):
    app_main.merge (app_debug)

###############################################################################
###############################################################################

if ARGs.get ('debug') or not ARGs.get ('no_sass'):
    for path, dns, fns in os.walk('static/css'):
        for filename in filter(lambda fn: fn.endswith('.scss'), fns):

            scss_path = os.path.join(path, filename)
            css_path = scss_path.replace('.scss', '.css')

            if not os.path.exists(css_path):
                with open(css_path, 'w') as css_file:

                    if not ARGs.get ('debug'):
                        css = cc.compress(sass.compile_file(scss_path))
                    else:
                        css = sass.compile_file(scss_path)

                    css_file.write(css)

###############################################################################
###############################################################################
