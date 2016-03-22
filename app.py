#!/usr/bin/env python
###############################################################################

import ARGs
import argparse
import bottle
import importlib
import os
import sys

###############################################################################
###############################################################################

PYCART_DIR = "".join (['python-', '.'.join (map (str, sys.version_info[:2]))])

###############################################################################
###############################################################################

try:
    zvirtenv = os.path.join (os.environ.get ('OPENSHIFT_HOMEDIR', '.'),
        PYCART_DIR, 'virtenv', 'bin', 'activate_this.py')
    exec (compile (open (zvirtenv).read (), zvirtenv, 'exec'), dict(
        __file__=zvirtenv))
except IOError:
   pass

###############################################################################
###############################################################################

## IMPORTANT: Put any additional includes below this line!

###############################################################################
###############################################################################

if __name__ == '__main__':

    parser = argparse.ArgumentParser (
        description="""NoTex Weblog Service""",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument ('--host', metavar='HOST',
        default=os.environ.get ('OPENSHIFT_PYTHON_IP', 'localhost'),
        help='Host to listen on')
    parser.add_argument ('--port', metavar='PORT', type=int,
        default=os.environ.get ('OPENSHIFT_PYTHON_PORT', 8881),
        help='Port to listen on')

    parser.add_argument ('--db-uri', metavar='OPENSHIFT_POSTGRESQL_DB_URL',
        help='Database connection URL', default=os.environ.get (
            'OPENSHIFT_POSTGRESQL_DB_URL', 'postgresql://notex@localhost/notex'))
    parser.add_argument ('--db-create', '-c', action='store_true',
        default=os.environ.get ('OPENSHIFT_POSTGRESQL_DB_CREATE', False),
        help='Database table creation')
    parser.add_argument ('--db-drop', '-D', action='store_true',
        default=os.environ.get ('OPENSHIFT_POSTGRESQL_DB_DROP', False),
        help='Database table drop')
    parser.add_argument ('--db-echo', action='store_true',
        default=os.environ.get ('OPENSHIFT_POSTGRESQL_DB_ECHO', False),
        help='Database verbosity')

    parser.add_argument ('--memcached-servers', metavar='MEMCACHEDCLOUD_SERVERS',
        default=os.environ.get ('MEMCACHEDCLOUD_SERVERS', 'localhost:11211'),
        help='Memcached server(s)')
    parser.add_argument ('--memcached-username', metavar='MEMCACHEDCLOUD_USERNAME',
        default=os.environ.get ('MEMCACHEDCLOUD_USERNAME', None),
        help='Memcached username')
    parser.add_argument ('--memcached-password', metavar='MEMCACHEDCLOUD_PASSWORD',
        default=os.environ.get ('MEMCACHEDCLOUD_PASSWORD', None),
        help='Memcached password')
    parser.add_argument ('--memcached-flush', action='store_true',
        default=os.environ.get ('MEMCACHEDCLOUD_FLUSH', False),
        help='Memcached flush flag')

    parser.add_argument ('--redis-host', metavar='REDISCLOUD_HOSTNAME',
        default=os.environ.get ('REDISCLOUD_HOSTNAME', 'localhost'),
        help='Redis host')
    parser.add_argument ('--redis-port', metavar='REDISCLOUD_PORT',
        default=os.environ.get ('REDISCLOUD_PORT', 6379),
        help='Redis port', type=int)
    parser.add_argument ('--redis-password', metavar='REDISCLOUD_PASSWORD',
        default=os.environ.get ('REDISCLOUD_PASSWORD', None),
        help='Redis password')
    parser.add_argument ('--redis-flush-db', metavar='REDIS_FLUSH_DB',
        default=os.environ.get ('REDISCLOUD_FLUSH_DB', None), type=list,
        help='Redis DB(s) to flush', const=map (str, range (1)), nargs='?')

    parser.add_argument ('--session-expiry', metavar='SESSION_EXPIRY',
        default=os.environ.get ('SESSION_EXPIRY', True),
        help='Session expiry', type=bool)
    parser.add_argument ('--session-timeout', metavar='SESSION_TIMEOUT',
        default=os.environ.get ('SESSION_TIMEOUT', None),
        help='Session timeout', type=int)
    parser.add_argument ('--session-key', metavar='SESSION_KEY',
        default=os.environ.get ('SESSION_KEY', 'secret'),
        help='Session key')

    parser.add_argument ('-S', '--no-sass',
        default=os.environ.get ('NO_SASS', False),
        help='SASS flag', action='store_true')
    parser.add_argument ('-d', '--debug',
        default=os.environ.get ('DEBUG', False),
        help='Debug flag', action='store_true')
    parser.add_argument ('-r', '--reload',
        default=os.environ.get ('RELOAD', False),
        help='Reload flag', action='store_true')
    parser.add_argument ('-w', '--wsgi',
        default=os.environ.get ('WSGI', 'waitress'),
        help='WSGI server to use', metavar='WSGI')

    ARGs.put (parser.parse_args ())

    wsgi = importlib.import_module ('wsgi')
    bottle.run (app=wsgi.application, server=ARGs.get ('wsgi'),
        host=ARGs.get ('host'), port=ARGs.get ('port'),
        debug=ARGs.get ('debug'), reloader=ARGs.get ('reload'))

###############################################################################
###############################################################################
