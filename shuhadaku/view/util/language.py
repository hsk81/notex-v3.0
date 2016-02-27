#!/usr/bin/env python
###############################################################################

from bottle import request

###############################################################################
###############################################################################

def languages():
    return ['en', 'de']

def detect(default):
    accept_language = request.headers.get('Accept-Language', 'en')
    accept_language = accept_language.lower()

    for language in languages():
        if language in accept_language:
            return language

    return default


###############################################################################
###############################################################################
