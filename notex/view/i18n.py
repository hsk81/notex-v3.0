#!/usr/bin/env python
###############################################################################

from bottle import Bottle
from bottle import response
from bottle import request

from notex.cache import redis_cache_1 as rdb
from notex.view.util.i18n import get
from notex import ARGs

import ujson as JSON

###############################################################################
###############################################################################

app_i18n = Bottle()
app = app_i18n

###############################################################################
###############################################################################

@app.get('/i18n/<language>/<key:path>')
@app.get('/i18n/<language>')
def i18n(language, key=None):

    force = request.query.get('force') or 'false'
    assert force
    force = JSON.decode(force)
    assert force or not force

    if force:
        response.content_type = 'application/json'
        return JSON.encode(get(language, key, force))

    @rdb.memoize(expiry=rdb.NEVER, unless=lambda: ARGs.debug())
    def memoized(*args, **kwargs):
        response.content_type = 'application/json'
        return JSON.encode(get(language, key, force))

    if key is not None:
        name = 'views.i18n:{0}/{1}?force{2}'.format(language, key, force)
    else:
        name = 'views.i18n:{0}?force={1}'.format(language, force)

    return memoized(name=name)

###############################################################################
###############################################################################
