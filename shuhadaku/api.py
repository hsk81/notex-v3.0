__author__ = 'hsk81'

###############################################################################
###############################################################################

from bottle import Bottle
from bottle import request

from shuhadaku.db import aliased
from shuhadaku.db import db_plugin
from shuhadaku.models import Group
from shuhadaku.models import Attribute

from shuhadaku.models import TypeValue
from shuhadaku.models import TextValue
from shuhadaku.models import RealValue
from shuhadaku.models import BoolValue

###############################################################################
###############################################################################

app_api = Bottle ()
app_api.install (db_plugin)

###############################################################################

rx = 're:[a-z0-9](:?[\:\-\.]?[a-z0-9]+)*' ## name regex

###############################################################################
###############################################################################

@app_api.post ('/group/g\:<name:{0}>'.format (rx))
def post_group (db, name):
    post_sub_group (db, name=name, root_path=None)

@app_api.get ('/group/g\:<name:{0}>'.format (rx))
def get_group (db, name):
    return get_sub_group (db, name=name, root_path=None)

@app_api.put ('/group/g\:<name:{0}>'.format (rx))
def put_group (db, name):
    put_sub_group (db, name=name, root_path=None)

@app_api.delete ('/group/g\:<name:{0}>'.format (rx))
def delete_group (db, name):
    delete_sub_group (db, name=name, root_path=None)

###############################################################################

@app_api.post ('/sub-group/g\:<root_path:{0}>/g\:<name:{0}>'.format (rx))
def post_sub_group (db, root_path, name):
    add_group (db, name, root=group_of (db, root_path))

@app_api.get ('/sub-group/g\:<root_path:{0}>/g\:<name:{0}>'.format (rx))
def get_sub_group (db, root_path, name):
    g = db.query (Group) \
        .filter_by (name=name, root=group_of (db, root_path)).one ()
    return g.json

@app_api.put ('/sub-group/g\:<root_path:{0}>/g\:<name:{0}>'.format (rx))
def put_sub_group (db, root_path, name):
    g = db.query (Group) \
        .filter_by (name=name, root=group_of (db, root_path)).one ()
    update_group (db, g)

@app_api.delete ('/sub-group/g\:<root_path:{0}>/g\:<name:{0}>'.format (rx))
def delete_sub_group (db, root_path, name):
    g = db.query (Group) \
        .filter_by (name=name, root=group_of (db, root_path)).one ()
    db.delete (g)

###############################################################################
###############################################################################

@app_api.post ('/attribute/g\:<group_path:{0}>/a\:<name:{0}>'.format (rx))
def post_attribute (db, group_path, name):
    add_attribute (db, name, group=group_of (db, group_path))

@app_api.get ('/attribute/g\:<group_path:{0}>/a\:<name:{0}>'.format (rx))
def get_attribute (db, group_path, name):
    a = db.query (Attribute) \
        .filter_by (name=name, group=group_of (db, group_path)).one ()
    return a.json

@app_api.put ('/attribute/g\:<group_path:{0}>/a\:<name:{0}>'.format (rx))
def put_attribute (db, group_path, name):
    a = db.query (Attribute) \
        .filter_by (name=name, group=group_of (db, group_path)).one ()
    update_attribute (db, a)

@app_api.delete ('/attribute/g\:<group_path:{0}>/a\:<name:{0}>'.format (rx))
def delete_attribute (db, group_path, name):
    a = db.query (Attribute) \
        .filter_by (name=name, group=group_of (db, group_path)).one ()
    db.delete (a)

###############################################################################

@app_api.post ('/sub-attribute' +
   '/g\:<group_path:{0}>/a\:<root_path:{0}>/a\:<name:{0}>'.format (rx))
def post_sub_attribute (db, group_path, root_path, name):
    root = attribute_of (db, root_path, group=group_of (db, group_path))
    add_attribute (db, name, root=root)

@app_api.get ('/sub-attribute' +
   '/g\:<group_path:{0}>/a\:<root_path:{0}>/a\:<name:{0}>'.format (rx))
def get_sub_attribute (db, group_path, root_path, name):
    root = attribute_of (db, root_path, group=group_of (db, group_path))
    a = db.query (Attribute).filter_by (name=name, root=root).one ()
    return a.json

@app_api.put ('/sub-attribute' +
   '/g\:<group_path:{0}>/a\:<root_path:{0}>/a\:<name:{0}>'.format (rx))
def put_sub_attribute (db, group_path, root_path, name):
    root = attribute_of (db, root_path, group=group_of (db, group_path))
    a = db.query (Attribute).filter_by (name=name, root=root).one ()
    update_attribute (db, a)

@app_api.delete ('/sub-attribute' +
   '/g\:<group_path:{0}>/a\:<root_path:{0}>/a\:<name:{0}>'.format (rx))
def delete_sub_attribute (db, group_path, root_path, name):
    root = attribute_of (db, root_path, group=group_of (db, group_path))
    a = db.query (Attribute).filter_by (name=name, root=root).one ()
    db.delete (a)

###############################################################################
###############################################################################

def group_of (db, path, many=False, regex='^{0}$', op='~'):
    names = path.split (':') if path else [None]; n = names.pop ()
    g = db.query (Group).filter (Group.name.op (op) (regex.format (n))) \
        if n is not None else None

    gi, gj = Group, aliased (Group)
    while g is not None and len (names) > 0:
        g = g.join (gj, gi.root).filter_by (name=names.pop ())
        gi, gj = gj, aliased (Group)

    return (g.one () if not many else g.all ()) \
        if g is not None else None

def attribute_of (db, path, group):
    names = path.split (':') if path else [None]; n = names.pop ()
    a = db.query (Attribute).filter_by (name=n) if n is not None else None

    ai, aj = Attribute, aliased (Attribute)
    while a is not None and len (names) > 0:
        a = a.join (aj, ai.root).filter_by (name=names.pop ())
        ai, aj = aj, aliased (Attribute)

    return a.filter_by (group=group).one () \
        if a is not None and group is not None else None

###############################################################################

def add_group (db, name, root=None):
    uuid = request.json.get ('uuid') if request.json else None
    group = Group (name, root=root, uuid=uuid)

    db.add (group)
    return group

def add_attribute (db, name, root=None, group=None):
    uuid = request.json.get ('uuid') if request.json else None
    type = request.json.get ('type') if request.json else None

    if type is not None:
        type_group = group_of (db, path=type)
    else:
        type_group = None

    attribute = Attribute (name,
        type=type_group, value=add_value (db, type_group),
        group=group, root=root, uuid=uuid)

    db.add (attribute)
    return attribute

def add_value (db, type_group):
    data = request.json.get ('data') if request.json else None
    mime = request.json.get ('mime') if request.json else None

    if type_group is not None:
        name = type_group.name.replace ('-', '_')
        assert len (name) > 0

        if name == TextValue.__tablename__:
            value = TextValue (data=data, mime=mime)
        elif name == RealValue.__tablename__:
            value = RealValue (data=data)
        elif name == BoolValue.__tablename__:
            value = BoolValue (data=data)
        elif data is None:
            value = TypeValue (data=type_group)
        else:
            value = TypeValue (data=group_of (db, path=name + ':' + data))
    else:
        value = None

    if value is not None:
        db.add (value)
    return value

###############################################################################

def update_group (db, g):
    name = request.json.get ('name') if request.json else None
    if name is not None:
        g.name = name

    db.add (g)
    return g

def update_attribute (db, a):
    name = request.json.get ('name') if request.json else None
    if name is not None:
        a.name = name

    type = request.json.get ('type') if request.json else None
    if type is not None:
        a.type = group_of (db, path=type)
    if a.type is not None:
        a.value = add_value (db, a.type)

    db.add (a)
    return a

###############################################################################
###############################################################################
