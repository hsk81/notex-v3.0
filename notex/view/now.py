#!/usr/bin/env python
###############################################################################

from bottle import Bottle
from bottle import request
from datetime import datetime

###############################################################################
###############################################################################

app_now = Bottle()
app = app_now

###############################################################################
###############################################################################

@app.get('/now')
def now():

    return '[{0}] {1}'.format(datetime.now(),
        request.get_header('host', 'localhost').capitalize())

###############################################################################
###############################################################################
