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
    url='http://shuhadaku-hsk81.rhcloud.com',
    install_requires=[
        'Beaker>=1.7.0',
        'bottle>=0.12.8',
        'compressinja>=0.0.2',
        'Jinja2>=2.8',
        'marshmallow>=2.0.0b4 ',
        'psycopg2>=2.6.1',
        'pycrypto>=2.6.1',
        'requests>=2.7.0',
        'redis>=2.10.5',
        'ujson>=1.33',
        'SQLAlchemy>=1.0.8',
        'waitress>=0.8.9',
        'Werkzeug>=0.10.4'
    ],
)

###############################################################################
###############################################################################
