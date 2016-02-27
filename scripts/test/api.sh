#!/bin/bash
###############################################################################
SCRIPT_PATH=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd) ;
###############################################################################
## GROUPs ================================================================== ##
###############################################################################

curl -vs -XPOST $SHUHADAKU/api/group/g:test ;
curl -vs -XPUT $SHUHADAKU/api/group/g:test \
     -H'Content-Type:application/json' -d'{"name":"tested"}' ;
curl -vs -XGET $SHUHADAKU/api/group/g:tested ;
curl -vs -XDELETE $SHUHADAKU/api/group/g:tested ;

###############################################################################
## SUB-GROUPs ============================================================== ##
###############################################################################

curl -vs -XPOST $SHUHADAKU/api/group/g:root ;

###############################################################################

curl -vs -XPOST $SHUHADAKU/api/sub-group/g:root/g:test ;
curl -vs -XPUT $SHUHADAKU/api/sub-group/g:root/g:test \
     -H'Content-Type:application/json' -d'{"name":"tested"}' ;
curl -vs -XGET $SHUHADAKU/api/sub-group/g:root/g:tested ;
curl -vs -XDELETE $SHUHADAKU/api/sub-group/g:root/g:tested ;

###############################################################################

curl -vs -XDELETE $SHUHADAKU/api/group/g:root ;

###############################################################################
## ATTRIBUTEs ============================================================== ##
###############################################################################

curl -vs -XPOST $SHUHADAKU/api/group/g:group ;

###############################################################################

curl -vs -XPOST $SHUHADAKU/api/attribute/g:group/a:test \
     -d'{"type":"text-value", "data":"test"}' \
     -H'content-type:application/json' ;

curl -vs -XPUT $SHUHADAKU/api/attribute/g:group/a:test \
     -d'{"name":"tested"}' \
     -H'content-type:application/json' ;
curl -vs -XPUT $SHUHADAKU/api/attribute/g:group/a:tested \
     -d'{"type":"real-value", "data":"0.0"}' \
     -H'content-type:application/json' ;
curl -vs -XPUT $SHUHADAKU/api/attribute/g:group/a:tested \
     -d'{"type":"bool-value", "data":"true"}' \
     -H'content-type:application/json' ;

curl -vs -XGET $SHUHADAKU/api/attribute/g:group/a:tested ;
curl -vs -XDELETE $SHUHADAKU/api/attribute/g:group/a:tested  ;

###############################################################################

curl -vs -XDELETE $SHUHADAKU/api/group/g:group ;

###############################################################################
## SUB-ATTRIBUTEs ========================================================== ##
###############################################################################

curl -vs -XPOST $SHUHADAKU/api/group/g:group ;
curl -vs -XPOST $SHUHADAKU/api/attribute/g:group/a:root ;

###############################################################################

curl -vs -XPOST $SHUHADAKU/api/sub-attribute/g:group/a:root/a:test \
     -d'{"type":"text-value", "data":"test"}' \
     -H'content-type:application/json' ;

curl -vs -XPUT $SHUHADAKU/api/sub-attribute/g:group/a:root/a:test \
     -d'{"name":"tested"}' \
     -H'content-type:application/json' ;
curl -vs -XPUT $SHUHADAKU/api/sub-attribute/g:group/a:root/a:tested \
     -d'{"type":"real-value", "data":"0.0"}' \
     -H'content-type:application/json' ;
curl -vs -XPUT $SHUHADAKU/api/sub-attribute/g:group/a:root/a:tested \
     -d'{"type":"bool-value", "data":"true"}' \
     -H'content-type:application/json' ;

curl -vs -XGET $SHUHADAKU/api/sub-attribute/g:group/a:root/a:tested ;
curl -vs -XDELETE $SHUHADAKU/api/sub-attribute/g:group/a:root/a:tested  ;

###############################################################################

curl -vs -XDELETE $SHUHADAKU/api/attribute/g:group/a:root ;
curl -vs -XDELETE $SHUHADAKU/api/group/g:group ;

###############################################################################
###############################################################################
