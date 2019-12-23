__author__ = 'hsk81'

###############################################################################
###############################################################################

from bottle import request
from .cache import redis_cache_1 as rdb

import bottle, hashlib, inspect, re, ujson as JSON, uuid

###############################################################################
###############################################################################

class AaaPlugin (object):

    _rx = r'^(:?{0})$'
    name = 'aaa'
    api = 2

    @property
    def keyword(self):
        return self._keyword

    @property
    def current (self):
        token = request.session.get ('token')
        if token:
            return self._rdb.get ('USERs/' + self.to_login(token))
        else:
            return None

    @property
    def login (self):
        current = self.current
        if current:
            return self.to_login(current['email'])
        else:
            return None

    @property
    def roles (self):
        current = self.current
        if current:
            return current['roles'] or []
        else:
            return None

    @property
    def anonymous (self):
        return not request.session.get ('token', False)

    def __init__ (self, roles, users, keyword='aaa'):

        self._roles = roles
        self._users = users
        self._keyword = keyword
        self._rdb = rdb

        for role in roles:
            self._rdb.set('ROLEs/' + role, True)

        for name in users:
            self._rdb.set('USERs/' + name, users[name])

    def setup (self, app):

        for plugin in app.plugins:
            if not isinstance (plugin, AaaPlugin):
                continue
            if plugin.keyword == self._keyword:
                raise bottle.PluginError ('conflicting plugins')

    def apply (self, callback, route):

        config = route.config
        if 'aaa' in config:
            get_config = lambda k, d: config.get ('aaa', {}).get (k, d)
        else:
            get_config = lambda k, d: config.get ('aaa.' + k, d)

        keyword = get_config ('keyword', self._keyword)
        argspec = inspect.getargspec (route.callback)
        if keyword not in argspec.args: return callback

        def decorator (*args, **kwargs):
            kwargs[keyword] = self
            return callback (*args, **kwargs)

        return decorator

    def do_login (self, login, password):
        assert login, 'missing login'
        assert password, 'missing password'

        if '@' in login: login = self.to_login(login)
        sha224 = hashlib.sha224 ('%r' % {'l': login, 'p': password})

        rec = self._rdb.get ('USERs/' + login)
        assert rec, '"%s" login does not exist' % login
        pwd = rec['hash'] == sha224.hexdigest()
        assert pwd, 'password is wrong'

        request.session['token'] = self.to_token(rec['email'])
        return rec

    def do_logout (self):
        token = request.session.get('token')
        assert token, 'not logged in'
        login = self.to_login (self.to_email(token))
        rec = self._rdb.get ('USERs/' + login)
        assert rec, '"%s" login does not exist' % login

        del request.session['token']
        return rec

    def do_register (self, email, password=None, roles=None):
        assert email, 'missing email'
        assert '@' in email, 'invalid email'

        password = uuid.uuid4() if not password else password
        roles = [u'user'] if not roles else JSON.decode(roles)

        login = self.to_login (email)
        user_rec = self._rdb.get ('USERs/' + login)
        assert not user_rec, '"%s" login already exists' % login

        for role in roles:
            role_rec = self._rdb.get ('ROLEs/' + role)
            assert role_rec, '"%s" role does not exists' % role

        self._rdb.set ('USERs/' + login, {
            'roles': roles, 'email': email, 'hash': hashlib.sha224('%r' % {
                'l': login, 'p': password
            }).hexdigest()
        })

        return self._rdb.get ('USERs/' + login)

    def require (self, role=None, user=None):
        token = request.session.get ('token')
        if token is None:
            assert role is None, 'not logged in'
            assert user is None, 'not logged in'
        else:
            login = self.to_login (self.to_email(token))
            rec = self._rdb.get ('USERs/' + login)

            if role is not None:
                rx_role = self._rx.format (role)

                def matching(rec_role): return re.match (rx_role, rec_role)
                assert len (filter (matching, rec.get ('roles', []))) > 0, \
                    '"%s" role(s) required' % role

            if user is not None:
                rx_user = self._rx.format (user)
                assert re.match (rx_user, rec.get ('name')), \
                    '"%s" user(s) required' % user

    @staticmethod
    def to_login(email):
        if email and not email.startswith('@'):
            return email.split('@')[0]
        else:
            return email

    @staticmethod
    def to_token(email):
        return email

    @staticmethod
    def to_email(token):
        return token

###############################################################################

aaa_plugin = AaaPlugin (roles=['admin', 'user'], users={'admin': {
    'hash': '4038176be4e27be4410db32682ea7788f8e97fe75cce099393d47d96',
    'roles': ['admin', 'user'], 'email': 'admin@mail.net'
}, 'user': {
    'hash': '30d39f0523b45d49d508c828768efcd2480eac8c7f51262d691c8604',
    'roles': ['user'], 'email': 'user@mail.net'
}})

###############################################################################
###############################################################################
