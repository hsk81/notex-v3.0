#!/usr/bin/env python
###############################################################################

from setuptools import setup

###############################################################################
###############################################################################

setup (
    name='notex',
    version='4.0.0',
    description='Markdown editor',
    author='Hasan Karahan',
    author_email='hasan.karahan@blackhan.com',
    url='https://hsk81@bitbucket.org/hsk81/notex.git',
    install_requires=[
        'Beaker>=1.11.0',
        'bottle>=0.12.19',
        'compressinja>=0.0.2',
        'gevent>=21.1.2',
        'gunicorn>=20.0.4',
        'Jinja2>=3.0.0a1',
        'pycrypto>=2.6.1',
        'rcssmin>=1.0.6',
        'redis>=3.5.3',
        'ujson>=4.0.2',
        'Werkzeug>=1.0.1'
    ],
)

###############################################################################
###############################################################################
