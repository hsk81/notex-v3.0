#!/usr/bin/env python
###############################################################################

from bottle import request
from datetime import date

import ARGs, os, ujson as JSON

###############################################################################
###############################################################################

from jinja2 import Environment, FileSystemLoader
env = Environment (loader=FileSystemLoader('./template'))

if not ARGs.get ('debug'):
    env.add_extension ('compressinja.html.HtmlCompressor')

env.globals.update ({'JSON': JSON})

###############################################################################

def generic (tpl_name, **kwargs):
    domain = request.get_header ('host')
    keywords = get_keywords (tpl_name, domain=domain)
    tpl = env.get_template(tpl_name + '.html')

    return tpl.render (
        debug=ARGs.get (key='debug'),
        email=get_mailto (), description=get_description (tpl_name),
        domain=domain, keywords=keywords, today=date.today (), **kwargs)

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

    base = '{0}: Weblog Service'.format (view.capitalize ())
    if view == 'home':
        return os.environ.get ('DESCRIPTION_HOME', base)
    elif view == 'contact':
        return os.environ.get ('DESCRIPTION_CONTACT', base)
    else:
        return os.environ.get ('DESCRIPTION', base)

###############################################################################
###############################################################################
