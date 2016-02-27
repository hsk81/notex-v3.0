__author__ = 'hsk81'

###############################################################################
###############################################################################

from bottle import Bottle

from shuhadaku.api import app_api
from shuhadaku.view.debug import app_debug
from shuhadaku.view.home import app_home
from shuhadaku.view.index import app_index
from shuhadaku.view.login import app_login
from shuhadaku.view.now import app_now
from shuhadaku.view.static import app_static

import ARGs

###############################################################################
###############################################################################

app_main = Bottle ()
app_main.merge (app_home)
app_main.merge (app_index)
app_main.merge (app_login)
app_main.merge (app_now)
app_main.merge (app_static)
app_main.mount ('/api', app_api)

if ARGs.get ('debug'):
    app_main.merge (app_debug)

###############################################################################
###############################################################################
