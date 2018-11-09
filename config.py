#
# see: docs.gunicorn.org/en/stable/settings.html
#

import fnmatch
import os

def glob(path, pattern):

    for root, dirnames, filenames in os.walk(path):
        for filename in fnmatch.filter(filenames, pattern):
            yield os.path.join(root, filename)

# see: docs.gunicorn.org/en/stable/settings.html#reload
reload = True

# see: docs.gunicorn.org/en/stable/settings.html#reload-engine
reload_extra_files = []
reload_extra_files += list(glob('static', '*.js'))
reload_extra_files += list(glob('static', '*.scss'))

# see: docs.gunicorn.org/en/stable/settings.html#worker-class
worker_class = "gevent"
