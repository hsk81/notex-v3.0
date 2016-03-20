__author__ = 'hsk81'

###############################################################################
###############################################################################

import ARGs, abc, bottle, functools, hashlib, inspect, pickle, redis

###############################################################################
###############################################################################

class NotexCache (object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractproperty
    def NEVER (self): return
    @abc.abstractproperty
    def ASAP (self): return

    @abc.abstractmethod
    def get (self, key, expiry=None): return
    @abc.abstractmethod
    def get_number (self, key, expiry=None): return
    @abc.abstractmethod
    def get_value (self, key, expiry=None): return
    @abc.abstractmethod
    def set (self, key, value, expiry=None): pass
    @abc.abstractmethod
    def set_number (self, key, value, expiry=None): pass
    @abc.abstractmethod
    def set_value (self, key, value, expiry=None): pass
    @abc.abstractmethod
    def delete (self, key): pass
    @abc.abstractmethod
    def expire (self, key, expiry=None): pass
    @abc.abstractmethod
    def exists (self, key): return
    @abc.abstractmethod
    def increase (self, key, expiry=None): pass
    @abc.abstractmethod
    def decrease (self, key, expiry=None): pass
    @abc.abstractmethod
    def flush_all (self): pass

    ###########################################################################

    @staticmethod
    def make_key (*args, **kwargs):

        kwargs.update (
            dict (map (lambda t: (str (t[0]), t[1]), enumerate (args))))
        string = repr (sorted (kwargs.items ())).encode('utf-8')
        hashed = hashlib.md5 (string)

        return hashed.hexdigest ()

    def prefix_key (self, key):
        return self.KEY_PREFIX + key

    KEY_PREFIX = 'cache:'

    ###########################################################################

    def cached (
            self, expiry=None, name=None, keyfunc=None, unless=None, lest=None):

        if not callable (keyfunc):
            keyfunc = lambda sid, fn, *args, **kwargs: \
                self.make_key (sid, name or fn.__name__) ## no (kw)args!

        return self.memoize (expiry, name, keyfunc, unless, lest)

    def memoize (
            self, expiry=None, name=None, keyfunc=None, unless=None, lest=None):

        if not callable (keyfunc):
            keyfunc = self.make_key

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*args, **kwargs):

                if callable (unless) and unless ():
                    return fn (*args, **kwargs)
                if callable (lest) and lest (*args, **kwargs):
                    return fn (*args, **kwargs)

                value_key = keyfunc (name or fn.__name__, *args, **kwargs)
                cached_value = self.get (value_key)

                if cached_value is None:
                    cached_value = fn (*args, **kwargs)
                    self.set (value_key, cached_value, expiry=expiry)

                return cached_value

            decorated.uncached = fn
            decorated.expiry = expiry

            return decorated
        return decorator

    ###########################################################################

    def version (self, expiry=None, *args, **kwargs):

        def decorator (fn):
            @functools.wraps (fn)
            def decorated (*fn_args, **fn_kwargs):

                version_key = self.version_key (*args, **kwargs)
                version = self.get_number (version_key) or 0
                value_key = self.make_key (version, *args, **kwargs)
                cached_value = self.get (value_key)

                if not cached_value:
                    cached_value = fn (*fn_args, **fn_kwargs)
                    self.set_number (version_key, version, expiry=self.NEVER)
                    self.set (value_key, cached_value, expiry=expiry)

                return cached_value

            decorated.uncached = fn
            decorated.expiry = expiry

            return decorated
        return decorator

    def increase_version (self, *args, **kwargs):
        self.increase (self.version_key (*args, **kwargs))

    def decrease_version (self, *args, **kwargs):
        self.decrease (self.version_key (*args, **kwargs))

    @staticmethod
    def version_key (*args, **kwargs):
        return EddbCache.make_key ('version', *args, **kwargs)

###############################################################################

class NotexRedisPlugin (NotexCache):

    name = 'redis'
    api = 2

    @property
    def NEVER (self):
        return None
    @property
    def ASAP (self):
        return 0

    def __init__ (self, host, port=6379, password=None, db=0, keyword='rdb'):

        self.host, self.port = host, port
        self.password, self.db = password, db
        self.keyword = keyword

    def setup (self, app):

        for plugin in app.plugins:
            if not isinstance (plugin, EddbRedisPlugin):
                continue
            if plugin.keyword == self.keyword:
                raise bottle.PluginError ('conflicting plugins')

    def close (self):
        if hasattr (self, '_connection'):
            pass

    def apply (self, callback, route):

        config = route.config
        if 'redis' in config:
            get_config = lambda k, d: config.get ('redis', {}).get (k, d)
        else:
            get_config = lambda k, d: config.get ('redis.' + k, d)

        keyword = get_config ('keyword', self.keyword)
        argspec = inspect.getargspec (route.callback)
        if keyword not in argspec.args: return callback

        def decorator (*args, **kwargs):
            kwargs[keyword] = self
            return callback (*args, **kwargs)

        return decorator

    def get (self, key, expiry=None):
        value = self.get_value (key, expiry=expiry)
        if value: return pickle.loads (value)

    def get_number (self, key, expiry=None):
        value = self.get_value (key, expiry=expiry)
        if value: return int (value)

    def get_value (self, key, expiry=None):
        if not expiry:
            return self.connection.get (self.KEY_PREFIX + key)
        else:
            return self.connection.pipeline ().get (self.KEY_PREFIX + key) \
                .expire (self.KEY_PREFIX + key, time=expiry) \
                .execute ().pop (0)

    def set (self, key, value, expiry=None):
        self.set_value (key, pickle.dumps (value), expiry=expiry)

    def set_number (self, key, value, expiry=None):
        self.set_value (key, int (value), expiry=expiry)

    def set_value (self, key, value, expiry=None):
        if expiry == self.NEVER:
            self.connection.pipeline ().set (self.KEY_PREFIX + key, value) \
                .persist (self.KEY_PREFIX + key).execute ()
        else:
            self.connection.pipeline ().set (self.KEY_PREFIX + key, value) \
                .expire (self.KEY_PREFIX + key, time=expiry).execute ()

    def delete (self, key):
        self.connection.delete (self.KEY_PREFIX + key)

    def expire (self, key, expiry=0): ## self.ASAP
        if expiry == self.NEVER:
            self.connection.persist (self.KEY_PREFIX + key)
        else:
            self.connection.expire (self.KEY_PREFIX + key, time=expiry)

    def exists (self, key):
        return self.connection.exists (self.KEY_PREFIX + key)

    def increase (self, key, expiry=None):
        if expiry == self.NEVER:
            return self.connection.pipeline ().incr (self.KEY_PREFIX + key) \
                .persist (self.KEY_PREFIX + key) \
                .execute ().pop (0)
        else:
            return self.connection.pipeline ().incr (self.KEY_PREFIX + key) \
                .expire (self.KEY_PREFIX + key, time=expiry) \
                .execute ().pop (0)

    def decrease (self, key, expiry=None):
        if expiry == self.NEVER:
            return self.connection.pipeline ().decr (self.KEY_PREFIX + key) \
                .persist (self.KEY_PREFIX + key) \
                .execute ().pop (0)
        else:
            return self.connection.pipeline ().decr (self.KEY_PREFIX + key) \
                .expire (self.KEY_PREFIX + key, time=expiry) \
                .execute ().pop (0)

    def flush_all (self):
        self.connection.flushall ()

    ###########################################################################

    @property
    def connection (self):
        if not hasattr (self, '_connection'):
            setattr (self, '_connection', self.connect ())
        return getattr (self, '_connection')

    def connect (self):
        return redis.StrictRedis (
            host=self.host, port=self.port, password=self.password, db=self.db)

###############################################################################

## std: cache for views etc.
redis_plugin_0 = NotexRedisPlugin (db=0,
    host=ARGs.get ('redis_host', 'localhost'),
    port=ARGs.get ('redis_port', 6379),
    password=ARGs.get ('redis_password', None))

## aaa: cache for authentication etc.
redis_plugin_1 = NotexRedisPlugin (db=0,
    host=ARGs.get ('redis_host', 'localhost'),
    port=ARGs.get ('redis_port', 6379),
    password=ARGs.get ('redis_password', None))

if ARGs.get ('redis_flush_db') is not None:
    if '0' in ARGs.get ('redis_flush_db'):
        redis_plugin_0.flush_all ()
    if '1' in ARGs.get ('redis_flush_db'):
        redis_plugin_1.flush_all ()

###############################################################################
###############################################################################
