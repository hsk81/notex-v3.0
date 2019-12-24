#!/usr/bin/env python
###############################################################################

from setuptools import setup

###############################################################################
###############################################################################

setup (
    name='notex',
    version='3.1.1',
    description='blog editor',
    author='Hasan Karahan',
    author_email='hasan.karahan@blackhan.com',
    url='https://hsk81@bitbucket.org/hsk81/notex.git',
    install_requires=[
        'Beaker>=1.11.0',
        'bottle>=0.12.18',
        'compressinja>=0.0.2',
        'gevent==1.4.0',
        'gunicorn>=20.0.4',
        'Jinja2>=2.10.3',
        'libsass>=0.19.4',
        'pycrypto>=2.6.1',
        'rcssmin>=1.0.6',
        'redis>=3.3.11',
        'ujson>=1.35',
        'Werkzeug>=0.16.0'
    ],
)

###############################################################################
###############################################################################
