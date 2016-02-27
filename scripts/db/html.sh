#!/bin/bash
###############################################################################
SCRIPT_PATH=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd) ;
###############################################################################

CREATE sub-group/g:html/g:en
CREATE sub-group/g:html/g:de

###############################################################################

CREATE attribute/g:html:en/a:7e09 \
     '{"type":"text-value", "data":"Shuhadaku: Weblog Service"}'
CREATE attribute/g:html:de/a:7e09 \
     '{"type":"text-value", "data":"Shuhadaku: Weblog Dienst"}'

###############################################################################
###############################################################################
