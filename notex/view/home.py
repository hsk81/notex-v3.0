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

app_home = Bottle()
app = app_home

###############################################################################
###############################################################################

@app.get('/home/<path:path>.html')
@app.get('/home')
def home(path=None):

    @rdb.memoize(
        expiry=rdb.NEVER, unless=lambda: ARGs.debug() or aaa.current)
    def memoized(*args, **kwargs):

        html = os.path.join('home', path) if path is not None else 'home'
        return generic(html, i18n=get(detect('en')), title=ARGs.get(
            'TITLE_HOME', 'Censorship Free Intellectual Property Platform'
        ))

    if path is not None:
        name = 'views.home:{0}.html:{1}'.format(path, detect('en'))
    else:
        name = 'views.home:{0}'.format(detect('en'))

    return memoized(name=name)

###############################################################################
###############################################################################
