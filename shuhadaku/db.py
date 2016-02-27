__author__ = 'hsk81'

###############################################################################
###############################################################################

from sqlalchemy import create_engine, orm
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import aliased
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.scoping import ScopedSession

import ARGs, bottle, inspect, os, re

###############################################################################
###############################################################################

from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import Enum
from sqlalchemy import ForeignKey
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import LargeBinary
from sqlalchemy import Numeric
from sqlalchemy import Sequence
from sqlalchemy import String
from sqlalchemy import UniqueConstraint

###############################################################################

from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PgUUID
import uuid

class UUID (TypeDecorator):
    impl = CHAR

    def load_dialect_impl (self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor (PgUUID ())
        else:
            return dialect.type_descriptor (CHAR (32))

    def process_bind_param (self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str (value)
        else:
            if not isinstance (value, uuid.UUID):
                return "%.32x" % uuid.UUID (value)
            else:
                return "%.32x" % int (value)

    def process_result_value (self, value, dialect):
        return value if value is None else uuid.UUID (value)

    @classmethod
    def random (cls):
        return uuid.uuid4 ()

###############################################################################
###############################################################################

class ShuhadakuSession (orm.Session):

    def script (self, path):

        if isinstance (path, list):
            path = os.path.sep.join (path)
        with open (path) as file:
            sql = file.read ()

        self.execute (sql)

class ShuhadakuQuery (orm.Query):

    orm.Query.back = orm.Query.reset_joinpoint

class ShuhadakuBase (object):

    @declared_attr
    def __tablename__ (cls):
        return cls.convert (cls.__name__)

    @declared_attr
    def id (cls):
        return Column (Integer, Sequence (
            cls.__tablename__ + '_id_seq'), primary_key=True)

    rx_1st_cap = re.compile (r'(.)([A-Z][a-z]+)')
    rx_all_cap = re.compile (r'([a-z0-9])([A-Z])')

    @classmethod
    def convert (cls, value):
        value = cls.rx_1st_cap.sub (r'\1_\2', value)
        value = cls.rx_all_cap.sub (r'\1_\2', value)
        return value.lower()

    query_class = ShuhadakuQuery

class ShuhadakuPolymorphic (object):
    subtype = Column ('subtype', String (32), nullable=False, index=False)

    @declared_attr
    def __mapper_args__ (cls): return {
        'polymorphic_identity': cls.__name__, 'polymorphic_on': cls.subtype
    }

class ShuhadakuOrmPlugin (object):

    name = 'sqlalchemy'
    api = 2

    def __init__ (self, uri, create=True, drop=False, echo=False, keyword='db'):

        self.engine = create_engine (uri, echo=echo)
        self.session_maker = orm.sessionmaker (self.engine, ShuhadakuSession)
        self.session_manager = orm.scoped_session (self.session_maker)

        self.base = declarative_base (cls=ShuhadakuBase)
        self.base.query = \
            self.session_manager.query_property (query_cls=ShuhadakuQuery)

        self.keyword = keyword
        self.create = create
        self.drop = drop

    def setup (self, app):

        for plugin in app.plugins:
            if not isinstance (plugin, ShuhadakuOrmPlugin):
                continue
            if plugin.keyword == self.keyword:
                raise bottle.PluginError ('conflicting plugins')

        if self.drop:
            self.base.metadata.drop_all (self.engine)
        if self.create:
            self.base.metadata.create_all (self.engine)

    def close (self):
        self.session_manager.remove ()

    @property
    def session (self):
        return self.session_manager ()

    def apply (self, callback, route):

        config = route.config
        if 'sqlalchemy' in config:
            get_config = lambda k, d: config.get ('sqlalchemy', {}).get (k, d)
        else:
            get_config = lambda k, d: config.get ('sqlalchemy.' + k, d)

        keyword = get_config ('keyword', self.keyword)
        argspec = inspect.getargspec (route.callback)
        if keyword not in argspec.args: return callback

        def decorator (*args, **kwargs):
            kwargs[keyword] = self.session

            if kwargs.get ('nested', False):
                self.session.begin (nested=True)

            try:
                result = callback (*args, **kwargs)
                self.session.commit ()
                return result
            except bottle.HTTPResponse:
                self.session.commit ()
                raise
            except:
                self.session.rollback ()
                raise
            finally:
                self.session_manager.remove()

        return decorator

###############################################################################

db_plugin = ShuhadakuOrmPlugin (
    uri=ARGs.get ('db_uri', 'sqlite:///:memory:'),
    create=ARGs.get ('db_create', False),
    drop=ARGs.get ('db_drop', False),
    echo=ARGs.get ('db_echo', False))

Base = db_plugin.base
Polymorphic = ShuhadakuPolymorphic

###############################################################################
###############################################################################
