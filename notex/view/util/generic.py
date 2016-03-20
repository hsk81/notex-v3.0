#!/usr/bin/env python
###############################################################################

from bottle import jinja2_template
from bottle import request
from datetime import date

import ARGs, os, ujson as JSON

###############################################################################
###############################################################################

def generic (view, **kwargs):
    domain = request.get_header ('host')
    keywords = get_keywords (view, domain=domain)

    return template (view, debug=ARGs.get (key='debug'),
        email=get_mailto (), description=get_description (view),
        domain=domain, keywords=keywords, today=date.today (), **kwargs)

def template (*args, **kwargs):

    def extend (name, key, value):
        if name not in kwargs:
            kwargs[name] = {key: value}
        elif key not in kwargs[name]:
            kwargs[name][key] = value
        else:
            kwargs[name][key].extend (value)

    def update (name, key, value):
        if name not in kwargs:
            kwargs[name] = {key: value}
        elif key not in kwargs[name]:
            kwargs[name][key] = value
        else:
            kwargs[name][key].update (value)

    if not ARGs.get ('debug'):
        extend ('template_settings', 'extensions', [
            'compressinja.html.HtmlCompressor'
        ])

    update ('template_settings', 'filters', {
        'json': JSON.dumps
    })

    return jinja2_template (*args, **kwargs)

###############################################################################

def get_mailto ():

    local_part = os.environ.get (
        'MAILTO_LOCAL', 'contact')
    domain_part = os.environ.get (
        'MAILTO_DOMAIN', request.get_header ('host'))
    return os.environ.get (
        'MAILTO', '{0}@{1}'.format (local_part, domain_part))

def get_keywords (view, domain):

    base = [domain.lower ()]
    if view == 'home':
        return os.environ.get ('KEYWORDs_HOME', base + ['home'])
    elif view == 'contact':
        return os.environ.get ('KEYWORDs_CONTACT', base + ['contact'])
    else:
        return os.environ.get ('KEYWORDs', base)

def get_description (view):

    base = '{0}: Energy Efficiency Database'.format (view.capitalize ())
    if view == 'home':
        return os.environ.get ('DESCRIPTION_HOME', base)
    elif view == 'contact':
        return os.environ.get ('DESCRIPTION_CONTACT', base)
    else:
        return os.environ.get ('DESCRIPTION', base)

###############################################################################
###############################################################################
