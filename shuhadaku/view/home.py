#!/usr/bin/env python
###############################################################################

from bottle import Bottle, request

from shuhadaku.aaa import aaa_plugin as aaa
from shuhadaku.cache import redis_plugin_0 as rdb
from shuhadaku.db import db_plugin

from shuhadaku.view.util.database import html_for
from shuhadaku.view.util.generic import generic
from shuhadaku.view.util.language import detect

import ARGs

###############################################################################
###############################################################################

app_home = Bottle ()
app_home.install (db_plugin)
app = app_home

###############################################################################
###############################################################################

@app.get ('/home')
def home (db):

    @rdb.memoize (expiry=None, unless=lambda: aaa.current or ARGs.debug ())
    def memoized (*args, **kwargs):

        return generic ('home', html=html_for (db, detect('en')))

    return memoized (name='views.home:' + detect('en'))

###############################################################################
###############################################################################
