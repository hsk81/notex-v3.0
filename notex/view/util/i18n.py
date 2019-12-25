#!/usr/bin/env python
###############################################################################

from bottle import request

import os.path
import ujson as JSON

###############################################################################
###############################################################################

def all():

    return ['en', 'de']

def detect(default):

    accept_language = request.headers.get('Accept-Language', 'en')
    accept_language = accept_language.lower()

    for language in all():
        if language in accept_language:
            return language

    return default

def get(language, key=None, force=False):
    global _I18N

    if '_I18N' not in globals():
        _I18N = {}

    if not hasattr(_I18N, language) or force:
        i18n_file = '{0}.json'.format(language)
        assert i18n_file
        i18n_path = os.path.join('./static/i18n', i18n_file)
        assert i18n_path

        with open(i18n_path) as i18n_file:
            _I18N[language] = JSON.decode(i18n_file.read())

    if key is None:
        return _I18N[language]
    else:
        item = _I18N[language]
        keys = key.split('/')

        while len(keys) > 0:
            if type(item) == list:
                item = item[int(keys.pop(0))]
            else:
                item = item[str(keys.pop(0))]

        return item

###############################################################################
###############################################################################
