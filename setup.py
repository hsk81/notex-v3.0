#!/usr/bin/env python
###############################################################################

from setuptools import setup

###############################################################################
###############################################################################

setup (
    name='notex',
    version='3.0.1',
    description='blog editor',
    author='Hasan Karahan',
    author_email='hasan.karahan@blackhan.com',
    url='https://hsk81@bitbucket.org/hsk81/notex.git',
    install_requires=[
        'Beaker>=1.10.0',
        'bottle>=0.12.13',
        'compressinja>=0.0.2',
        'gevent>=1.3.7',
        'gunicorn>=19.9.0',
        'Jinja2>=2.10',
        'marshmallow>=3.0.0b20',
        'psycopg2-binary>=2.7.5',
        'py2-ipaddress>=3.4.1',
        'python-binary-memcached>=0.24.6',
        'pycrypto>=2.6.1',
        'rcssmin>=1.0.6',
        'requests>=2.20.0',
        'redis>=2.10.6',
        'rjsmin>=1.0.12',
        'sass>=2.3',
        'SQLAlchemy>=1.2.13',
        'ujson>=1.35',
        'Werkzeug>=0.14.1'
    ],
)

###############################################################################
###############################################################################
