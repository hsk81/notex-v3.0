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

app_blogs = Bottle()
app = app_blogs

###############################################################################
###############################################################################

@app.get('/blogs/<path:path>.html')
@app.get('/blogs')
def blogs(path=None):

    @rdb.memoize(
        expiry=rdb.NEVER, unless=lambda: ARGs.debug() or aaa.current)
    def memoized(*args, **kwargs):

        html = os.path.join('blogs', path) if path is not None else 'blogs'
        return generic(
            html + '/index', i18n=get(detect('en')), title=ARGs.get(
                'TITLE_BLOGS', 'List of Certified Publications'
            )
        )

    if path is not None:
        name = 'views.blogs:{0}.html:{1}'.format(path, detect('en'))
    else:
        name = 'views.blogs:{0}'.format(detect('en'))

    return memoized(name=name)

###############################################################################
###############################################################################
