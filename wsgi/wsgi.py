#!/usr/bin/env python
###############################################################################

from bottle import request
from beaker.middleware import SessionMiddleware
from werkzeug.debug import DebuggedApplication

from notex.app import app_main
from notex.app import ARGs

###############################################################################
###############################################################################

app = app_main

###############################################################################

if ARGs.debug():
    app.catchall = False
    app = DebuggedApplication(app, evalex=True)

###############################################################################

##
## Beaker Documentation: http://beaker.readthedocs.org/en/latest/index.html
##

app = SessionMiddleware(app, {
    'session.auto': True,
    'session.cookie_expires': ARGs.get('SESSION_EXPIRY', True),
    'session.encrypt_key': ARGs.get('SESSION_KEY', 'secret'),
    'session.httponly': True,
    'session.timeout': ARGs.get('SESSION_TIMEOUT', None),
    'session.type': 'cookie',
    'session.validate_key': True
})

@app_main.hook('before_request')
def before_request():

    request.session = request.environ['beaker.session']

###############################################################################
###############################################################################

application = app

###############################################################################
###############################################################################
