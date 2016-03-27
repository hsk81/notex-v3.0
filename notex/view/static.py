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
def server_fonts (*args, **kwargs):

    app_dns = os.environ.get ('OPENSHIFT_APP_DNS')
    req_dns = request.headers.get ('host')

    if app_dns == req_dns:
        return static_file ('robots-disallow.txt', root='./static/txt')
    else:
        return static_file('robots-allow.txt', root='./static/txt')

###############################################################################
###############################################################################
