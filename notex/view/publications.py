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

app_publications = Bottle()
app = app_publications

###############################################################################
###############################################################################

@app.get('/publications/<path:path>.html')
@app.get('/publications')
def publications(path=None):

    @rdb.memoize(
        expiry=rdb.NEVER, unless=lambda: ARGs.debug() or aaa.current)
    def memoized(*args, **kwargs):

        html = os.path.join('publications', path) \
            if path is not None else 'publications'
        return generic(html, i18n=get(detect('en')), title=ARGs.get(
            'TITLE_PUBLICATIONS',
            'Censorship Free Intellectual Property Platform: Publications'
        ))

    if path is not None:
        name = 'views.publications:{0}.html:{1}'.format(path, detect('en'))
    else:
        name = 'views.publications:{0}'.format(detect('en'))

    return memoized(name=name)

###############################################################################
###############################################################################
