#!/usr/bin/env python
###############################################################################

from bottle import Bottle, request
from notex.aaa import aaa_plugin as aaa

import ujson as JSON

###############################################################################
###############################################################################

app_login = Bottle()
app = app_login

###############################################################################
###############################################################################

@app.route('/anonymous')
def anonymous():
    aaa.require(role=None, user=None)
    return JSON.encode(aaa.anonymous)

@app.route('/login')
def login(*args, **kwargs):
    aaa.require(role=None, user=None)

    email = request.params.get('email')
    assert email
    password = request.params.get('password')
    assert password

    user = aaa.do_login(email, password)
    assert user is not None
    assert user == aaa.current
    assert not aaa.anonymous

    return JSON.encode(user)

@app.route('/logout')
def logout(*args, **kwargs):
    aaa.require(role=r'admin|user', user=None)

    user = aaa.do_logout()
    assert user is not None
    assert user != aaa.current
    assert aaa.anonymous

    return JSON.encode(user)

@app.route('/register')
def register(*args, **kwargs):
    aaa.require(role=r'admin', user=None)

    email = request.params.get('email')
    assert email
    password = request.params.get('password')
    assert password or not password
    roles = request.params.get('roles')
    assert roles or not roles

    user = aaa.do_register(email, password=password, roles=roles)
    assert user is not None
    assert user != aaa.current
    assert not aaa.anonymous

    return JSON.encode(user)

###############################################################################
###############################################################################
