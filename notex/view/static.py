#!/usr/bin/env python
###############################################################################

from bottle import Bottle, request
from bottle import static_file
from notex import ARGs

import os
import re
import ujson as JSON

###############################################################################
###############################################################################

app_static = Bottle()
app = app_static

###############################################################################
###############################################################################

@app.get('/<any:path>/@npm/index.<ext:re:[^/]+>')
def npm_index(any, name='index', ext='js'):

    path = '{0}.{1}'.format(name, ext)
    root = os.path.normpath('static/js/app')
    return static_file(path, root=root)

@app.get('/<any:path>/@npm/markdownItAnchor.<ext:re:[^/]+>')
@app.get('/<any:path>/@npm/markdown-it-anchor.<ext:re:[^/]+>')
def npm_mdi_anchor(any, name='markdown-it-anchor', ext='js'):

    return npm_resolve(name, item='unpkg', ext=ext)

@app.get('/<any:path>/@npm/markdown-it-figure.<ext:re:[^/]+>')
def npm_mdi_figure(any, name='markdown-it-figure-0.3.2', ext='js'):

    path = 'markdown-it/{0}.min.{1}'.format(name, ext)
    root = os.path.normpath('static/js/lib')
    return static_file(path, root=root)

@app.get('/<any:path>/@npm/markdown-it-sub.<ext:re:[^/]+>')
def npm_mdi_sub(any, name='markdown-it-sub-2.0.0', ext='js'):

    path = 'markdown-it/{0}.min.{1}'.format(name, ext)
    root = os.path.normpath('static/js/lib')
    return static_file(path, root=root)

@app.get('/<any:path>/@npm/markdown-it-sup.<ext:re:[^/]+>')
def npm_mdi_sup(any, name='markdown-it-sup-2.0.0', ext='js'):

    path = 'markdown-it/{0}.min.{1}'.format(name, ext)
    root = os.path.normpath('static/js/lib')
    return static_file(path, root=root)

@app.get('/<any:path>/@npm/ipfs.<ext:re:[^/]+>')
def npm_ipfs(any, name='ipfs', ext='js'):

    path = 'dist/{0}.min.{1}'.format('index', ext)
    root = os.path.normpath('node_modules/{0}'.format(name))
    return static_file(path, root=root)

###############################################################################

@app.get('/<any:path>/@npm/<name:re:[^/]+>/<path:path>.<ext:re:[^/]+>')
@app.get('/<any:path>/@npm/<name:re:[^/]+>.<ext:re:[^/]+>')
def npm(any, name, path=None, ext='js'):

    path = 'dist/{0}.{1}'.format(path if path is not None else name, ext)
    root = os.path.normpath('node_modules/{0}'.format(name))
    return static_file(path, root=root)

def npm_resolve(name, item='main', ext=None):

    pack_path = 'node_modules/{0}/package.json'.format(name)
    pack_path = os.path.normpath(pack_path)

    with open(pack_path, 'r') as pack_file:
        pack_json = JSON.decode(pack_file.read())

    path = npm_extend(pack_json[item], ext)
    assert path
    root = os.path.normpath('node_modules/{0}'.format(name))
    assert root

    return static_file(path, root=root)

def npm_extend(path, ext=None):

    if ext:
        for i in range(len(ext), 0, -1):
            if re.search(ext[:i] + '$', path): break
        return path[:-i] + ext
    else:
        return path

###############################################################################
###############################################################################

@app.get('/node_modules/<path:path>')
def node_modules(path):

    return static_file(path, root='node_modules')

@app.get('/static/<path:path>')
def static(path):

    return static_file(path, root='./static')

@app.get('/fonts/<path:path>')
def fonts(path):

    return static_file(path, root='./static/fonts')

@app.get('/robots.txt')
def robots_txt(*args, **kwargs):

    if not ARGs.get('ROBOTS_TXT', True):
        return static_file('robots-disallow.txt', root='./static/txt')
    else:
        return static_file('robots-allow.txt', root='./static/txt')

###############################################################################
###############################################################################
