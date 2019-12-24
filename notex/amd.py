__author__ = 'hsk81'

###############################################################################
###############################################################################

import subprocess
import ujson as JSON

###############################################################################
###############################################################################

def optimize(amd_conf, amd_opts={
        'req-path': './static/js/lib/require/r-2.3.6.js'
    }):

    with open(amd_conf, 'r') as amd_file:
        amd_json = JSON.decode(amd_file.read())

    req_path = amd_opts['req-path']
    assert req_path
    app_path = amd_json['out']
    assert app_path

    subprocess.call([
        "/usr/bin/env", "node", req_path, "-o", amd_conf])

    return app_path

###############################################################################
###############################################################################
