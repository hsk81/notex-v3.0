#!/usr/bin/env python
###############################################################################

from setuptools import setup

###############################################################################
###############################################################################

setup (
    name='notex',
    version='1.0.0',
    description='blog editor',
    author='Hasan Karahan',
    author_email='hasan.karahan@blackhan.com',
    url='https://hsk81@bitbucket.org/hsk81/notex.git',
    install_requires=[
        'Beaker>=1.8.0',
        'bottle>=0.12.9',
        'compressinja>=0.0.2',
        'Jinja2>=2.8',
        'marshmallow>=2.6.0 ',
        'psycopg2>=2.6.1',
        'py2-ipaddress>=3.4.1',
        'python-binary-memcached>=0.24.6',
        'pycrypto>=2.6.1',
        'rcssmin>=1.0.6',
        'requests>=2.9.1',
        'redis>=2.10.5',
        'rjsmin>=1.0.12',
        'sass>=2.3',
        'SQLAlchemy>=1.0.12',
        'ujson>=1.35',
        'waitress>=0.8.10',
        'Werkzeug>=0.11.4'
    ],
)

###############################################################################
###############################################################################
