__author__ = 'hsk81'

###############################################################################
###############################################################################

import ujson as JSON
import subprocess
import os.path
import gzip

###############################################################################
###############################################################################

def optimize(amd_conf, optimizer="./static/js/lib/require/r-2.3.6.js"):

    subprocess.call(["/usr/bin/env", "node", optimizer, "-v"])
    subprocess.call(["/usr/bin/env", "node", optimizer, "-o", amd_conf])
    base_path, _ = os.path.split(amd_conf)

    with open(amd_conf, 'r') as json_file:
        json = JSON.decode(json_file.read())

    out_path = os.path.join(base_path, json['out'])

    with open(out_path, 'r') as out_file:
        with gzip.open(out_path + '.gz', 'wb') as zip_file:
            zip_file.write(out_file.read())

    return out_path

###############################################################################
###############################################################################
