#!/usr/bin/env python
###############################################################################

from bottle import request
from beaker.middleware import SessionMiddleware
from shuhadaku.app import app_main
from werkzeug.debug import DebuggedApplication

import ARGs

###############################################################################
###############################################################################

application = app_main

###############################################################################

if ARGs.get ('debug'):
    application.catchall = False
    application = DebuggedApplication(application, evalex=True)

###############################################################################

##
## Beaker Documentation: http://beaker.readthedocs.org/en/latest/index.html
##

application = SessionMiddleware(application, {
    'session.auto': True,
    'session.cookie_expires': ARGs.get ('session_expiry'),
    'session.encrypt_key': ARGs.get ('session_key'),
    'session.httponly': True,
    'session.timeout': ARGs.get ('session_timeout'),
    'session.type': 'cookie',
    'session.validate_key': True
})

@app_main.hook('before_request')
def before_request ():
    request.session = request.environ['beaker.session']

###############################################################################
###############################################################################
