__author__ = 'hsk81'

###############################################################################
###############################################################################

from bottle import Bottle
from notex.view.components import app_components
from notex.view.debug import app_debug
from notex.view.editor import app_edit
from notex.view.home import app_home
from notex.view.i18n import app_i18n
from notex.view.index import app_index
from notex.view.ipfs import app_ipfs
from notex.view.login import app_login
from notex.view.now import app_now
from notex.view.static import app_static
from notex import ARGs

###############################################################################
###############################################################################

app_main = Bottle()
app_main.merge(app_home)
app_main.merge(app_components)
app_main.merge(app_edit)
app_main.merge(app_i18n)
app_main.merge(app_index)
app_main.merge(app_ipfs)
app_main.merge(app_login)
app_main.merge(app_now)
app_main.merge(app_static)

if ARGs.debug():
    app_main.merge(app_debug)

###############################################################################
###############################################################################
