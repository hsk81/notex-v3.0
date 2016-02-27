#!/usr/bin/env python
###############################################################################

from bottle import Bottle, BottleException, request

###############################################################################
###############################################################################

app_debug = Bottle ()
app = app_debug

###############################################################################

global FILES
global FORMS
global GET
global PARAMS
global PATHS
global POST
global QUERY

@app.get ('/req')
@app.get ('/req/')
@app.get ('/req/<path:path>')
@app.post ('/req')
@app.post ('/req/')
@app.post ('/req/<path:path>')
def req (path=None):

    PATH = path.split ('/') if path else None
    FILES = request.files
    FORMS = request.forms
    GET = request.GET
    JSON = request.json
    PARAMS = request.params
    POST = request.POST
    QUERY = request.query

    def to_dict (multi_dict):
        return {k: multi_dict.getlist (k) for k in multi_dict.keys ()}

    ex = {}
    if PATH: ex['path'] = PATH
    if FILES: ex['files'] = to_dict (FILES)
    if FORMS: ex['forms'] = to_dict (FORMS)
    if GET: ex['get'] = to_dict (GET)
    if JSON: ex['json'] = to_dict (JSON)
    if PARAMS: ex['params'] = to_dict (PARAMS)
    if POST: ex['post'] = to_dict (POST)
    if QUERY: ex['query'] = to_dict (QUERY)

    raise BottleException (ex)

###############################################################################
###############################################################################
