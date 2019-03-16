#!/usr/bin/env python
###############################################################################

from bottle import Bottle, request
from bottle import static_file

import os

###############################################################################
###############################################################################

app_static = Bottle ()
app = app_static

###############################################################################
###############################################################################

@app.get ('/<any:path>/@npm/snabbdom/modules/<path:path>.<ext:re:[^/\.]+>')
def server_npm_snabbdom_modules (any, name='snabbdom', path=None, ext='js'):

    path = 'snabbdom-{0}.{1}'.format(path, ext)
    root = os.path.normpath('node_modules/{0}/dist'.format(name))
    return static_file (path, root=root)

@app.get ('/<any:path>/@npm/snabbdom/<path:path>.<ext:re:[^/\.]+>')
@app.get ('/<any:path>/@npm/snabbdom.<ext:re:[^/\.]+>')
def server_npm_snabbdom (any, name='snabbdom', path=None, ext='js'):

    path = '{0}.{1}'.format(path if path is not None else name, ext)
    root = os.path.normpath('node_modules/{0}/dist'.format(name))
    return static_file (path, root=root)

@app.get ('/<any:path>/@npm/<name:re:[^/]+>/<path:path>.<ext:re:[^/\.]+>')
@app.get ('/<any:path>/@npm/<name:re:[^/]+>.<ext:re:[^/\.]+>')
def server_npm (any, name, path=None, ext='js'):

    path = '{0}.{1}'.format(path if path is not None else name, ext)
    root = os.path.normpath('node_modules/{0}/dist'.format(name))
    return static_file (path, root=root)

###############################################################################

@app.get ('/static/<path:path>')
def server_static (path):

    return static_file (path, root='./static')

@app.get ('/fonts/<path:path>')
def server_fonts (path):

    return static_file (path, root='./static/fonts')

@app.get ('/robots.txt')
def server_robots (*args, **kwargs):

    if not os.environ.get ('ROBOTS_TXT', True):
        return static_file ('robots-disallow.txt', root='./static/txt')
    else:
        return static_file('robots-allow.txt', root='./static/txt')

###############################################################################
###############################################################################
