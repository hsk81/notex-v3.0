__author__ = 'hsk81'

###############################################################################
###############################################################################

from . import db
from marshmallow import fields
from marshmallow import Schema
from marshmallow.class_registry import get_class as get_schema
from marshmallow.compat import basestring

import ARGs, ujson as JSON

###############################################################################
###############################################################################

class PolymorphicField (fields.Field):

    def __init__ (self, mapping, default_schema, nested_kwargs=None, **kwargs):

        self.mapping = mapping
        self.default_schema = default_schema
        self.nested_kwargs = nested_kwargs or {}
        super(PolymorphicField, self).__init__(**kwargs)

    def _serialize (self, nested, attr, obj):
        if nested is None: return None

        nested_type = nested.__class__.__name__
        schema = self.mapping.get (nested_type, self.default_schema)

        if isinstance (schema, basestring): schema = get_schema(schema)
        return schema (**self.nested_kwargs).dump (nested).data

###############################################################################
###############################################################################

class Group (db.Base):
    __table_args__ = tuple ([
        db.UniqueConstraint ('name', 'root_id')])

    uuid = db.Column (db.UUID, unique=True, nullable=False)
    name = db.Column (db.String (256), unique=False, nullable=False)

    root_id = db.Column (db.Integer,
        db.ForeignKey ('group.id', ondelete='CASCADE'), index=True)
    root = db.orm.relation ('Group', remote_side='Group.id',
        backref=db.orm.backref ('groups', cascade='all, delete-orphan',
            primaryjoin='Group.id==Group.root_id', lazy='dynamic'))

    def __init__ (self, name, root=None, uuid=None):
        self.uuid = uuid if uuid is not None else db.UUID.random ()
        self.name, self.root = name, root

    def __repr__ (self):
        return u'<Group@%x/%s: "%s">' % (
            self.id if self.id else 0, self.uuid, self.name)

    @property
    def json (self):
        return GroupSerializer ().dump (self).data

    @property
    def path (self): ## TODO: implement caching!
        if self.root is not None:
            return self.root.path + ':' + self.name
        else:
            return self.name

class GroupSerializer (Schema):

    name = fields.String ()
    attributes = fields.Nested ('AttributeSerializer', many=True)

    class Meta: json_module = JSON; additional = tuple (['uuid']) \
        if ARGs.get ('api_with_uuid') else ()

###############################################################################
###############################################################################

class Attribute (db.Base):
    __table_args__ = tuple ([
        db.UniqueConstraint ('name', 'root_id'),
        db.UniqueConstraint ('name', 'group_id')])

    uuid = db.Column (db.UUID, unique=True, nullable=False)
    name = db.Column (db.String (256), unique=False, nullable=False)

    root_id = db.Column (db.Integer,
        db.ForeignKey ('attribute.id', ondelete='CASCADE'), index=True)
    root = db.orm.relation ('Attribute', remote_side='Attribute.id',
        backref=db.orm.backref ('attributes', cascade='all, delete-orphan',
            primaryjoin='Attribute.id==Attribute.root_id', lazy='dynamic'),
        lazy='joined')

    group_id = db.Column (db.Integer,
        db.ForeignKey ('group.id', ondelete='CASCADE'), index=True)
    group = db.orm.relationship ('Group', backref=db.orm.backref (
        'attributes', cascade='all, delete-orphan', lazy='joined'),
        foreign_keys=[group_id])

    type_id = db.Column (db.Integer,
        db.ForeignKey ('group.id', ondelete='CASCADE'), index=True)
    type = db.orm.relationship ('Group', backref=db.orm.backref (
        'types', cascade='all, delete-orphan', lazy='dynamic'),
        foreign_keys=[type_id])

    value_id = db.Column (db.Integer,
        db.ForeignKey ('value.id', ondelete='CASCADE'), index=True)
    value = db.orm.relationship ('Value', backref=db.orm.backref (
        'attribute', cascade='all, delete-orphan', uselist=False),
        foreign_keys=[value_id], lazy='joined')

    def __init__ (self, name, type=None, value=None,
                  group=None, root=None, uuid=None):

        self.uuid = uuid if uuid is not None else db.UUID.random ()
        self.name, self.type, self.value = name, type, value
        self.group, self.root = group, root

    def __repr__ (self):
        prefix = 'Attribute@%x/%s: "%s"; type="%s", value=%s' % (
            self.id if self.id else 0, self.uuid, self.name,
            self.type.name if self.type is not None else None, self.value)

        suffix = '@group="%s" @root="%s"' % (
            self.group.name if self.group is not None else None,
            self.root.name if self.root is not None else None)

        return '<' + prefix + ' ' + suffix + '>'

    @property
    def json (self):
        return AttributeSerializer ().dump (self).data

class AttributeSerializer (Schema):

    name = fields.String ()
    type = fields.Nested ('GroupSerializer')
    attributes = fields.Nested ('AttributeSerializer', many=True, exclude=(
        'type', 'attributes', 'value'
    ))

    value = fields.List (PolymorphicField (
        default_schema='ValueSerializer', mapping={
            'TypeValue': 'TypeValueSerializer',
            'TextValue': 'TextValueSerializer',
            'RealValue': 'RealValueSerializer',
            'BoolValue': 'BoolValueSerializer',
        }
    ))

    class Meta: json_module = JSON; additional = tuple (['uuid']) \
        if ARGs.get ('api_with_uuid') else ()

###############################################################################
###############################################################################

class Value (db.Base, db.Polymorphic):
    def __repr__ (self):
        return u'<Value@%x>' % (self.id if self.id else 0)

class ValueSerializer (Schema):
    class Meta: json_module = JSON

###############################################################################

class TypeValue (Value):
    type_value_id = db.Column (db.Integer,
        db.Sequence ('type_value_id_seq'), db.ForeignKey (
            'value.id', ondelete='CASCADE'), primary_key=True)

    data_id = db.Column (db.Integer,
        db.ForeignKey ('group.id', ondelete='CASCADE'), index=True, nullable=0)
    data = db.orm.relationship ('Group', backref=db.orm.backref (
        'values', cascade='all, delete-orphan', lazy='dynamic'),
        foreign_keys=[data_id])

    def __init__ (self, data):
        self.data = data

    def __repr__ (self):
        return u'<TypeValue@%x: data="%r">' % (
            self.type_value_id if self.type_value_id else 0, self.data)

    @property
    def json (self):
        return TypeValueSerializer ().dump (self).data

class TypeValueSerializer (Schema):
    data = fields.Nested ('GroupSerializer')
    class Meta: json_module = JSON

###############################################################################

class TextValue (Value):
    text_value_id = db.Column (db.Integer,
        db.Sequence ('text_value_id_seq'), db.ForeignKey (
            'value.id', ondelete='CASCADE'), primary_key=True)

    data = db.Column (db.String, nullable=True)
    mime = db.Column (db.String (32), nullable=True)

    def __init__ (self, data=None, mime=None):
        self.data, self.mime = data, mime

    def __repr__ (self):
        return u'<TextValue@%x: data="%s", mime="%s">' % (
            self.text_value_id if self.text_value_id else 0, self.data, self.mime)

    @property
    def json (self):
        return TextValueSerializer ().dump (self).data

class TextValueSerializer (Schema):
    class Meta: json_module = JSON; fields = tuple (['data', 'mime'])

###############################################################################

class RealValue (Value):
    real_value_id = db.Column (db.Integer,
        db.Sequence ('real_value_id_seq'), db.ForeignKey (
            'value.id', ondelete='CASCADE'), primary_key=True)

    data = db.Column (db.Numeric (asdecimal=False), nullable=True)

    def __init__ (self, data=None):
        self.data = data

    def __repr__ (self):
        return u'<RealValue@%x: data="%s">' % (
            self.real_value_id if self.real_value_id else 0, self.data)

    @property
    def json (self):
        return RealValueSerializer ().dump (self).data

class RealValueSerializer (Schema):
    class Meta: json_module = JSON; fields = tuple (['data'])

###############################################################################

class BoolValue (Value):
    bool_value_id = db.Column (db.Integer,
        db.Sequence ('bool_value_id_seq'), db.ForeignKey (
            'value.id', ondelete='CASCADE'), primary_key=True)

    data = db.Column (db.Boolean, nullable=True)

    def __init__ (self, data=None):
        self.data = data

    def __repr__ (self):
        return u'<BoolValue@%x: data="%s">' % (
            self.bool_value_id if self.bool_value_id else 0, self.data)

    @property
    def json (self):
        return BoolValueSerializer ().dump (self).data

class BoolValueSerializer (Schema):
    class Meta: json_module = JSON; fields = tuple (['data'])

###############################################################################

TypeValue.serializer = TypeValueSerializer
TextValue.serializer = TextValueSerializer
RealValue.serializer = RealValueSerializer
BoolValue.serializer = BoolValueSerializer

###############################################################################
###############################################################################
