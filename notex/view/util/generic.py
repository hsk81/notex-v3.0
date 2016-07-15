#!/usr/bin/env python
###############################################################################

from bottle import request
from datetime import date

import ARGs, os, ujson as JSON

###############################################################################
###############################################################################

from jinja2 import Environment, FileSystemLoader
env = Environment(loader=FileSystemLoader('./template'))

if not ARGs.get('debug'):
    env.add_extension('compressinja.html.HtmlCompressor')

env.globals.update({'JSON': JSON})

###############################################################################

def generic(tpl_name, **kwargs):
    tpl = env.get_template(tpl_name + '.html')

    return tpl.render(
        debug=ARGs.get(key='debug'),
        description=get_description(tpl_name),
        domain=get_domain(),
        email=get_mailto(),
        keywords=get_keywords(tpl_name, domain=get_domain()),
        today=date.today(),
        **kwargs)

###############################################################################

def get_domain():
    host = request.get_header('host') or ''
    domain = '.'.join(host.split('.')[-2:])
    print '[get:domain]', host, domain
    return domain

def get_description(view):

    base = '{0}'.format(view.capitalize())
    if view == 'editor':
        return os.environ.get('DESCRIPTION_EDITOR', base)
    else:
        return os.environ.get('DESCRIPTION', base)

def get_keywords(view, domain):

    base = [domain.lower()]
    if view == 'editor':
        return os.environ.get('KEYWORDs_EDITOR', base + ['editor'])
    else:
        return os.environ.get('KEYWORDs', base)

def get_mailto():

    local_part = os.environ.get(
        'MAILTO_LOCAL', 'contact')
    domain_part = os.environ.get(
        'MAILTO_DOMAIN', request.get_header('host'))

    return os.environ.get(
        'MAILTO', '{0}@{1}'.format(local_part, domain_part))

###############################################################################
###############################################################################
