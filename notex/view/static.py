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
