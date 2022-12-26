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
    py_modules=['notex'],
    install_requires=[
        'Beaker>=1.11.0',
        'bottle>=0.12.21',
        'compressinja>=0.0.2',
        'gevent>=21.12.0',
        'gunicorn>=20.1.0',
        'Jinja2>=3.1.2',
        'rcssmin>=1.1.0',
        'redis>=4.3.1',
        'ujson>=5.3.0',
        'Werkzeug>=2.1.2'
    ],
)

###############################################################################
###############################################################################
