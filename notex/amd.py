__author__ = 'hsk81'

###############################################################################
###############################################################################

import ujson as JSON
import subprocess
import os.path
import gzip

###############################################################################
###############################################################################

def optimize (json_path):
    subprocess.call(["/usr/bin/r.js", "-v"])
    subprocess.call(["/usr/bin/r.js", "-o", json_path])
    base_path, _ = os.path.split(json_path)

    with open(json_path, 'r') as json_file:
        json = JSON.decode(json_file.read())

    out_path = os.path.join(base_path, json['out'])

    with open(out_path, 'r') as out_file:
        with gzip.open(out_path + '.gz', 'wb') as zip_file:
            zip_file.write(out_file.read())

    return out_path

###############################################################################
###############################################################################
