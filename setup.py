#!/usr/bin/env python
###############################################################################

from setuptools import setup

###############################################################################
###############################################################################

setup (
    name='shuhadaku',
    version='0.0.1',
    description='weblog service',
    author='Hasan Karahan',
    author_email='hasan.karahan@blackhan.com',
    url='https://hsk81@bitbucket.org/hsk81/shuhadaku.git',
    install_requires=[
        'Beaker>=1.8.0',
        'bottle>=0.12.9',
        'compressinja>=0.0.2',
        'Jinja2>=2.8',
        'marshmallow>=2.6.0 ',
        'psycopg2>=2.6.1',
        'pycrypto>=2.6.1',
        'requests>=2.9.1',
        'redis>=2.10.5',
        'ujson>=1.35',
        'SQLAlchemy>=1.0.12',
        'waitress>=0.8.10',
        'Werkzeug>=0.11.4'
    ],
)

###############################################################################
###############################################################################
