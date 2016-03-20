#!/usr/bin/env python
###############################################################################

from notex.db import aliased
from notex.models import Attribute as A
from notex.models import Group as G

from notex.models import TypeValue
from notex.models import TextValue
from notex.models import RealValue
from notex.models import BoolValue

from itertools import groupby

###############################################################################
###############################################################################

class AttributeFor (object):

    @staticmethod
    def _of (entity, name, default=None):
        a_list = entity.attributes if entity else []
        result = list (filter (lambda a: a.name == name, a_list))

        if len (result) > 0:
            if result[0] is not None and result[0].value is not None:
                return result[0].value.data

        return default

    def __getattr__(self, item):
        return lambda entity, default=None: self._of (
            entity, name=item.replace ('_', '-'), default=default)

attribute_for = AttributeFor ()

###############################################################################

def html_for (db, g_name):

    return dict (enumerate (
        values_for (db, g_path='html:' + g_name))).get (0, {})

###############################################################################

def values_for (db, g_path, a_path=None, a_names=None, a_defaults=None,
                rx='^{0}$', op='~'):

    A0, a_paths = aliased(A), a_path.split (':') \
        if a_path is not None else []

    if a_names is None:
        query = db.query (A0.root_id, A0.group_id, A0)
    else:
        query = db.query (A0.root_id, A0.group_id, A0) \
            .filter (A0.name.in_ (a_names))

    while len (a_paths) > 0:
        A1 = aliased (A); query = query.join (A1, A1.id == A0.root_id) \
            .filter (A1.name.op (op)(rx.format (a_paths.pop ()))); A0 = A1

    G0, g_paths = aliased(G), g_path.split (':') \
        if g_path is not None else []
    query = query.join (G0, G0.id == A0.group_id) \
        .filter (G0.name.op (op)(rx.format (g_paths.pop ())))

    while len (g_paths) > 0:
        G1 = aliased (G); query = query.join (G1, G0.root) \
            .filter (G1.name.op (op)(rx.format (g_paths.pop ()))); G0 = G1

    gs, g = [], {}
    for _, a_group in groupby (sorted (query.all ()), lambda t: t[:2]):
        for rid, gid, a in a_group:

            if a.root is not None:
                g[u'type'] = type_for (a.root.value)

            if a.root is not None:
                g[u'root-name'] = a.root.name
                g[u'name'] = a.root.name

            if a.group is not None:
                g[u'group-name'] = a.group.name
                g[u'name'] = a.group.name

            if a_defaults is not None and a.name in a_defaults:
                if callable (a_defaults[a.name]):
                    g[a.name] = a_defaults[a.name] (a)
                else:
                    g[a.name] = a_defaults[a.name] \
                        if a.value is None else a.value.data
            else:
                if a.value is not None:
                    g[a.name] = a.value.data
                else:
                    g[a.name] = None

        gs.append (g); g = {}
    return gs

###############################################################################

def type_for (value): ## TODO: refactor?

    if type (value) == TypeValue:
        return value.data.path
    elif type (value) == TextValue:
        return TextValue.__tablename__.replace('_', '-')
    elif type (value) == RealValue:
        return RealValue.__tablename__.replace('_', '-')
    elif type (value) == BoolValue:
        return BoolValue.__tablename__.replace('_', '-')
    else:
        return None

###############################################################################
###############################################################################
