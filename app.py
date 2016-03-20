#!/usr/bin/env python
###############################################################################

import ARGs, argparse, importlib, os, sys, bottle

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

    parser.add_argument ('--redis-host', metavar='REDISCLOUD_HOSTNAME',
        default=os.environ.get ('REDISCLOUD_HOSTNAME', 'localhost'),
        help='Redis host')
    parser.add_argument ('--redis-port', metavar='REDISCLOUD_PORT',
        default=os.environ.get ('REDISCLOUD_PORT', 6379),
        help='Redis port', type=int)
    parser.add_argument ('--redis-password', metavar='REDISCLOUD_PASSWORD',
        default=os.environ.get ('REDISCLOUD_PASSWORD', None),
        help='Redis password')
    parser.add_argument ('--redis-flush-db', '-F', metavar='REDIS_FLUSH_DB',
        default=os.environ.get ('REDISCLOUD_FLUSH_DB', None), type=list, nargs='?',
        help='Redis DB(s) to flush', const=map (str, range (2)))

    parser.add_argument ('--session-expiry', metavar='SESSION_EXPIRY',
        default=os.environ.get ('SESSION_EXPIRY', True),
        help='Session expiry', type=bool)
    parser.add_argument ('--session-timeout', metavar='SESSION_TIMEOUT',
        default=os.environ.get ('SESSION_TIMEOUT', None),
        help='Session timeout', type=int)
    parser.add_argument ('--session-key', metavar='SESSION_KEY',
        default=os.environ.get ('SESSION_KEY', 'secret'),
        help='Session key')

    parser.add_argument ('-S', '--no-sass', default=False,
        help='SASS flag', action='store_true')
    parser.add_argument ('-d', '--debug', default=False,
        help='Debug flag', action='store_true')
    parser.add_argument ('-r', '--reload', default=False,
        help='Reload flag', action='store_true')
    parser.add_argument ('-w', '--wsgi', default='waitress',
        help='WSGI server to use', metavar='WSGI')

    ARGs.put (parser.parse_args ())

    wsgi = importlib.import_module ('wsgi')
    bottle.run (app=wsgi.application, server=ARGs.get ('wsgi'),
        host=ARGs.get ('host'), port=ARGs.get ('port'),
        debug=ARGs.get ('debug'), reloader=ARGs.get ('reload'))

###############################################################################
###############################################################################
