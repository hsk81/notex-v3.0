__author__ = 'hsk81'

###############################################################################
###############################################################################

import os
import ujson as JSON

###############################################################################
###############################################################################

def put(lookup):

    global _ARGs; _ARGs = dict(lookup)

def get(key, default=None):

    global _ARGs

    if '_ARGs' not in globals():
        _ARGs = {}

    if hasattr(_ARGs, key):
        return _ARGs.get(key, default)
    else:
        try:
            return JSON.decode(os.environ.get(key, default))
        except TypeError:
            return os.environ.get(key, default)
        except ValueError:
            return os.environ.get(key, default)

###############################################################################

def debug(*args, **kwargs):

    return bool(get('DEBUG', False))

###############################################################################
###############################################################################
