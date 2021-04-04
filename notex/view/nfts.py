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

app_nfts = Bottle()
app = app_nfts

###############################################################################
###############################################################################

@app.get('/nfts/<path:path>.html')
@app.get('/nfts')
def nfts(path=None):

    @rdb.memoize(
        expiry=rdb.NEVER, unless=lambda: ARGs.debug() or aaa.current)
    def memoized(*args, **kwargs):

        html = os.path.join('nfts', path) if path is not None else 'nfts'
        return generic(
            html + '/index', i18n=get(detect('en')), title=ARGs.get(
                'TITLE_NFTS', 'Certified Publications'
            )
        )

    if path is not None:
        name = 'views.nfts:{0}.html:{1}'.format(path, detect('en'))
    else:
        name = 'views.nfts:{0}'.format(detect('en'))

    return memoized(name=name)

###############################################################################
###############################################################################
