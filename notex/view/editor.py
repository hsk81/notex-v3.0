#!/usr/bin/env python
###############################################################################

from bottle import Bottle
from notex.aaa import aaa_plugin as aaa
from notex.cache import redis_cache_0 as rdb
from notex.view.util.generic import generic
from notex.view.util.language import detect
from notex import ARGs

###############################################################################
###############################################################################

app_edit = Bottle ()
app = app_edit

###############################################################################
###############################################################################

@app.get ('/editor')
def edit ():

    @rdb.memoize (
        expiry=rdb.NEVER, unless=lambda: ARGs.debug () or aaa.current)
    def memoized (*args, **kwargs):

        return generic ('editor')

    return memoized (name='views.editor:' + detect('en'))

###############################################################################
###############################################################################
