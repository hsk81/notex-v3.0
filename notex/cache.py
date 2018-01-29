__author__ = 'hsk81'

###############################################################################
###############################################################################

import abc
import bmemcached
import functools
import hashlib
import os
import redis

###############################################################################
###############################################################################

class AppCache(object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractproperty
    def NEVER(self): return
    @abc.abstractproperty
    def ASAP(self): return

    @abc.abstractmethod
    def get(self, key): return
    @abc.abstractmethod
    def set(self, key, value, expiry=None): pass
    @abc.abstractmethod
    def delete(self, key): pass
    @abc.abstractmethod
    def expire(self, key, expiry=None): pass
    @abc.abstractmethod
    def exists(self, key): return
    @abc.abstractmethod
    def flush_all(self): pass

    ###########################################################################

    @staticmethod
    def make_key(*args, **kwargs):

        kwargs.update(
            dict(map(lambda t:(str(t[0]), t[1]), enumerate(args))))
        string = repr(sorted(kwargs.items())).encode('utf-8')
        hashed = hashlib.md5(string)

        return hashed.hexdigest()

    def prefixed(self, key):
        return self.KEY_PREFIX + key

    KEY_PREFIX = 'cache:'

    ###########################################################################

    def cached(self,
               expiry=None, name=None, keyfunc=None, unless=None, lest=None):

        if expiry is None:
            expiry = self.NEVER
        if not callable(keyfunc):
            keyfunc = lambda sid, fn, *args, **kwargs: \
                self.make_key(sid, name or fn.__name__) ## no(kw)args!

        return self.memoize(expiry, name, keyfunc, unless, lest)

    def memoize(self,
                expiry=None, name=None, keyfunc=None, unless=None, lest=None):

        if expiry is None:
            expiry = self.NEVER
        if not callable(keyfunc):
            keyfunc = self.make_key

        def decorator(fn):
            @functools.wraps(fn)
            def decorated(*args, **kwargs):

                if callable(unless) and unless():
                    return fn(*args, **kwargs)
                if callable(lest) and lest(*args, **kwargs):
                    return fn(*args, **kwargs)

                value_key = keyfunc(name or fn.__name__, *args, **kwargs)
                cached_value = self.get(value_key)

                if cached_value is None:
                    cached_value = fn(*args, **kwargs)
                    self.set(value_key, cached_value, expiry=expiry)

                return cached_value

            decorated.uncached = fn
            decorated.expiry = expiry

            return decorated
        return decorator

###############################################################################

class AppMemcached(AppCache):

    @property
    def NEVER(self):
        return 0
    @property
    def ASAP(self):
        return None

    def __init__(self, servers, username=None, password=None):
        self.servers = servers
        self.username = username
        self.password = password

    def get(self, key):
        return self.connection.get(self.prefixed(key))

    def set(self, key, value, expiry=0): ## self.NEVER
        if expiry == self.ASAP:
            self.connection.delete(self.prefixed(key))
        else:
            self.connection.set(self.prefixed(key), value, time=expiry)

    def delete(self, key):
        self.connection.delete(self.prefixed(key))

    def expire(self, key, expiry=None): ## self.ASAP
        if expiry == self.ASAP:
            self.connection.delete(self.prefixed(key))
        else:
            self.connection.set(
                self.prefixed(key), self.connection.get(self.prefixed(key)),
                time=expiry)

    def exists(self, key):
        return self.connection.get(self.prefixed(key)) is not None

    def flush_all(self):
        self.connection.flush_all()

    ###########################################################################

    @property
    def connection(self):
        if not hasattr(self, '_connection'):
            setattr(self, '_connection', self.connect())
        return getattr(self, '_connection')

    def connect(self):
        return bmemcached.Client(
            self.servers, username=self.username, password=self.password)

    def close(self):
        if hasattr(self, '_connection'):
            self._connection.disconnect_all()

###############################################################################

class AppRedis(AppCache):

    name = 'redis'
    api = 2

    @property
    def NEVER(self):
        return None
    @property
    def ASAP(self):
        return 0

    def __init__(self, url, db=0):
        self.url, self.db = url, db

    def get(self, key):
        return self.connection.get(self.prefixed(key))

    def set(self, key, value, expiry=None): ## self.NEVER
        if expiry == self.NEVER:
            self.connection.pipeline().set(self.prefixed(key), value) \
                .persist(self.prefixed(key)).execute()
        else:
            self.connection.pipeline().set(self.prefixed(key), value) \
                .expire(self.prefixed(key), time=expiry).execute()

    def delete(self, key):
        self.connection.delete(self.prefixed(key))

    def expire(self, key, expiry=0): ## self.ASAP
        if expiry == self.NEVER:
            self.connection.persist(self.prefixed(key))
        else:
            self.connection.expire(self.prefixed(key), time=expiry)

    def exists(self, key):
        return self.connection.exists(self.prefixed(key))

    def flush_all(self):
        self.connection.flushall()

    ###########################################################################

    @property
    def connection(self):
        if not hasattr(self, '_connection'):
            setattr(self, '_connection', self.connect())
        return getattr(self, '_connection')

    def connect(self):
        return redis.StrictRedis.from_url(self.url, db=self.db)

    def close(self):
        if hasattr(self, '_connection'):
            pass

###############################################################################
###############################################################################

memcached_cache = AppMemcached( ## memoization
    servers=os.environ.get('MEMCACHED_SERVERS', 'localhost:11211').split(' '),
    username=os.environ.get('MEMCACHED_USERNAME', None),
    password=os.environ.get('MEMCACHED_PASSWORD', None))

###############################################################################

redis_cache_0 = AppRedis( ## authentication
    db=os.environ.get('REDIS_DB', os.environ.get('REDIS_DB0', '0')),
    url=os.environ.get('REDIS_URL', 'redis://localhost:6379'))

###############################################################################
###############################################################################

if os.environ.get('MEMCACHED_FLUSH') is not None:
    memcached_cache.flush_all()

if os.environ.get('REDIS_FLUSH_DB') is not None:
    if '0' in os.environ.get('REDIS_FLUSH_DB').split(' '):
        redis_cache_0.flush_all()

###############################################################################
###############################################################################
