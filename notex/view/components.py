#!/usr/bin/env python
###############################################################################

from bottle import Bottle
from notex.aaa import aaa_plugin as aaa
from notex.cache import redis_cache_1 as rdb
from notex.view.util.generic import generic
from notex.view.util.i18n import detect, get
from notex import ARGs

import os.path

###############################################################################
###############################################################################

app_components = Bottle()
app = app_components

###############################################################################
###############################################################################

@app.get('/components/<path:path><ext:re:\.html$>')
def components(path, ext):

    @rdb.memoize(
        expiry=rdb.NEVER, unless=lambda: ARGs.debug() or aaa.current)
    def memoized(*args, **kwargs):

        html = os.path.join('components', path)
        return generic(html, ext, i18n=get(detect('en')))

    name = 'views.components:{0}.html:{1}'.format(path, detect('en'))
    return memoized(name=name)

###############################################################################
###############################################################################
