#!/usr/bin/env python
###############################################################################

from bottle import Bottle, request

from notex.aaa import aaa_plugin as aaa
from notex.cache import redis_plugin_0 as rdb
from notex.db import db_plugin

from notex.view.util.database import html_for
from notex.view.util.generic import generic
from notex.view.util.language import detect

import ARGs

###############################################################################
###############################################################################

app_edit = Bottle ()
app_edit.install (db_plugin)
app = app_edit

###############################################################################
###############################################################################

@app.get ('/edit')
def edit (db):

    @rdb.memoize (expiry=None, unless=lambda: aaa.current or ARGs.debug ())
    def memoized (*args, **kwargs):

        return generic ('edit', html=html_for (db, detect('en')))

    return memoized (name='views.edit:' + detect('en'))

###############################################################################
###############################################################################
