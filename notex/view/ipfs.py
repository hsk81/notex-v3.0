#!/usr/bin/env python
###############################################################################

from bottle import Bottle, redirect

###############################################################################
###############################################################################

app_ipfs = Bottle()
app = app_ipfs

###############################################################################
###############################################################################

@app.get('/ipfs/<path:path>')
def editor(path):

    return redirect('https://ipfs.notexeditor.com/ipfs/' + path, 308)

###############################################################################
###############################################################################
