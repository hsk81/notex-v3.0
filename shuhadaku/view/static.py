#!/usr/bin/env python
###############################################################################

from bottle import Bottle
from bottle import static_file

###############################################################################
###############################################################################

app_static = Bottle ()
app = app_static

###############################################################################
###############################################################################

@app.get ('/static/<path:path>')
def server_static (path):

    return static_file (path, root='./static')

###############################################################################
###############################################################################
