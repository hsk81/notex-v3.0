#!/usr/bin/env python
###############################################################################

from bottle import Bottle
from notex.aaa import aaa_plugin as aaa
from notex.cache import redis_cache_1 as rdb
from notex.view.util.generic import generic
from notex.view.util.i18n import detect, get
from notex import ARGs

import os
import re

###############################################################################
###############################################################################

app_edit = Bottle()
app = app_edit

###############################################################################
###############################################################################

def match(pattern, names, default=None):

    names = list(filter(lambda name: re.match(pattern, name), names))
    return names[0] if len(names) > 0 else default

def bundles(path='./static/build'):

    names = os.listdir(path)
    return {
        'all.js': match('all-([^.]+).js$', names, default='all.js'),
        'all.css': match('all-([^.]+).css$', names, default='all.css')
    }

@app.get('/editor/<path:path>.html')
@app.get('/editor')
def editor(path=None):

    @rdb.memoize(
        expiry=rdb.NEVER, unless=lambda: ARGs.debug() or aaa.current)
    def memoized(*args, **kwargs):

        html = os.path.join('editor', path) if path is not None else 'editor'
        return generic(
            html + '/index', bundle=bundles(), i18n=get(detect('en')),
            title=ARGs.get('TITLE_EDITOR', 'Markdown Editor')
        )

    if path is not None:
        name = 'views.editor:{0}.html:{1}'.format(path, detect('en'))
    else:
        name = 'views.editor:{0}'.format(detect('en'))

    return memoized(name=name)

###############################################################################
###############################################################################
