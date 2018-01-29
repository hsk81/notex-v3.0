#!/usr/bin/env python
###############################################################################

from bottle import Bottle

from notex.aaa import aaa_plugin as aaa
from notex.cache import memcached_cache as mdb
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

@app.get ('/editor')
def edit (db):

    @mdb.memoize (expiry=mdb.NEVER, unless=lambda: ARGs.debug () or aaa.current)
    def memoized (*args, **kwargs):

        return generic ('editor', html=html_for (db, detect('en')))

    return memoized (name='views.editor:' + detect('en'))

###############################################################################
###############################################################################
