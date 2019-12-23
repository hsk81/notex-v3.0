__author__ = 'hsk81'

###############################################################################
###############################################################################

import abc
import functools
import hashlib
import os
import ujson as JSON

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
    def flush(self): pass

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
        value = self.connection.get(self.prefixed(key))
        return JSON.decode(value) if type(value) in (str, bytes) else value

    def set(self, key, value, expiry=None): ## self.NEVER
        if expiry == self.NEVER:
            self.connection.pipeline().set(self.prefixed(key), JSON.encode(value)) \
                .persist(self.prefixed(key)).execute()
        else:
            self.connection.pipeline().set(self.prefixed(key), JSON.encode(value)) \
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

    def flush(self):
        self.connection.flushdb()

    ###########################################################################

    @property
    def connection(self):
        if not hasattr(self, '_connection'):
            setattr(self, '_connection', self.connect())
        return getattr(self, '_connection')

    def connect(self):
        import redis
        return redis.StrictRedis.from_url(self.url, db=self.db)

    def close(self):
        if hasattr(self, '_connection'):
            getattr(self, '_connection').close()
            delattr(self, '_connection')

###############################################################################
###############################################################################

redis_cache_0 = AppRedis( ## memoization
    db=os.environ.get('REDIS_DB', os.environ.get('REDIS_DB0', '0')),
    url=os.environ.get('REDIS_URL', 'redis://localhost:6379'))

redis_cache_1 = AppRedis( ## authentication
    db=os.environ.get('REDIS_DB', os.environ.get('REDIS_DB1', '1')),
    url=os.environ.get('REDIS_URL', 'redis://localhost:6379'))

###############################################################################
###############################################################################

if os.environ.get('REDIS_FLUSH_DB') is not None:
    if 0 in JSON.decode(os.environ.get('REDIS_FLUSH_DB', '[0]')):
        redis_cache_0.flush()
    if 1 in JSON.decode(os.environ.get('REDIS_FLUSH_DB', '[0]')):
        redis_cache_1.flush()

###############################################################################
###############################################################################
