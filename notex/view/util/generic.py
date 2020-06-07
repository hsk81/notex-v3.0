#!/usr/bin/env python
###############################################################################

from bottle import request
from datetime import date
from notex import ARGs

import ipaddress
import ujson as JSON

###############################################################################
###############################################################################

from jinja2 import Environment, FileSystemLoader
env = Environment(loader=FileSystemLoader([
    './template', './static/js/app'
]))

if not ARGs.debug():
    env.add_extension('compressinja.html.HtmlCompressor')

env.globals.update({'JSON': JSON})

###############################################################################

def generic(tpl_name, **kwargs):
    tpl = env.get_template(tpl_name + '.html')

    return tpl.render(
        debug=ARGs.debug(),
        description=get_description(tpl_name),
        domain=get_domain(),
        email=get_mailto(),
        keywords=get_keywords(tpl_name, domain=get_domain()),
        today=date.today(),
        **kwargs)

###############################################################################

def get_domain():

    host = request.get_header('host') or ''
    try:
        return str(ipaddress.ip_address(host))
    except ValueError:
        try:
            ip, port = host.rsplit(':')
            ip = ipaddress.ip_address(ip)
            return '{0}:{1}'.format(ip, port) if port else str(ip)
        except ValueError:
            return '.'.join(host.split('.')[-2:])

def get_description(view):

    base = '{0}'.format(view.capitalize())
    if view == 'editor':
        return ARGs.get('DESCRIPTION_EDITOR', base)
    else:
        return ARGs.get('DESCRIPTION', base)

def get_keywords(view, domain):

    base = [domain.lower()]
    if view == 'editor':
        return ARGs.get('KEYWORDS_EDITOR', base + ['editor'])
    else:
        return ARGs.get('KEYWORDS', base)

def get_mailto():

    local_part = ARGs.get(
        'MAILTO_LOCAL', 'contact')
    domain_part = ARGs.get(
        'MAILTO_DOMAIN', request.get_header('host'))

    return ARGs.get(
        'MAILTO', '{0}@{1}'.format(local_part, domain_part))

###############################################################################
###############################################################################
