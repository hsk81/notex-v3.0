#!/bin/bash
###############################################################################
SCRIPT_PATH=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd) ;
###############################################################################
## GROUPs ================================================================== ##
###############################################################################

curl -vs -XPOST $NOTEX/api/group/g:test ;
curl -vs -XPUT $NOTEX/api/group/g:test \
     -H'Content-Type:application/json' -d'{"name":"tested"}' ;
curl -vs -XGET $NOTEX/api/group/g:tested ;
curl -vs -XDELETE $NOTEX/api/group/g:tested ;

###############################################################################
## SUB-GROUPs ============================================================== ##
###############################################################################

curl -vs -XPOST $NOTEX/api/group/g:root ;

###############################################################################

curl -vs -XPOST $NOTEX/api/sub-group/g:root/g:test ;
curl -vs -XPUT $NOTEX/api/sub-group/g:root/g:test \
     -H'Content-Type:application/json' -d'{"name":"tested"}' ;
curl -vs -XGET $NOTEX/api/sub-group/g:root/g:tested ;
curl -vs -XDELETE $NOTEX/api/sub-group/g:root/g:tested ;

###############################################################################

curl -vs -XDELETE $NOTEX/api/group/g:root ;

###############################################################################
## ATTRIBUTEs ============================================================== ##
###############################################################################

curl -vs -XPOST $NOTEX/api/group/g:group ;

###############################################################################

curl -vs -XPOST $NOTEX/api/attribute/g:group/a:test \
     -d'{"type":"text-value", "data":"test"}' \
     -H'content-type:application/json' ;

curl -vs -XPUT $NOTEX/api/attribute/g:group/a:test \
     -d'{"name":"tested"}' \
     -H'content-type:application/json' ;
curl -vs -XPUT $NOTEX/api/attribute/g:group/a:tested \
     -d'{"type":"real-value", "data":"0.0"}' \
     -H'content-type:application/json' ;
curl -vs -XPUT $NOTEX/api/attribute/g:group/a:tested \
     -d'{"type":"bool-value", "data":"true"}' \
     -H'content-type:application/json' ;

curl -vs -XGET $NOTEX/api/attribute/g:group/a:tested ;
curl -vs -XDELETE $NOTEX/api/attribute/g:group/a:tested  ;

###############################################################################

curl -vs -XDELETE $NOTEX/api/group/g:group ;

###############################################################################
## SUB-ATTRIBUTEs ========================================================== ##
###############################################################################

curl -vs -XPOST $NOTEX/api/group/g:group ;
curl -vs -XPOST $NOTEX/api/attribute/g:group/a:root ;

###############################################################################

curl -vs -XPOST $NOTEX/api/sub-attribute/g:group/a:root/a:test \
     -d'{"type":"text-value", "data":"test"}' \
     -H'content-type:application/json' ;

curl -vs -XPUT $NOTEX/api/sub-attribute/g:group/a:root/a:test \
     -d'{"name":"tested"}' \
     -H'content-type:application/json' ;
curl -vs -XPUT $NOTEX/api/sub-attribute/g:group/a:root/a:tested \
     -d'{"type":"real-value", "data":"0.0"}' \
     -H'content-type:application/json' ;
curl -vs -XPUT $NOTEX/api/sub-attribute/g:group/a:root/a:tested \
     -d'{"type":"bool-value", "data":"true"}' \
     -H'content-type:application/json' ;

curl -vs -XGET $NOTEX/api/sub-attribute/g:group/a:root/a:tested ;
curl -vs -XDELETE $NOTEX/api/sub-attribute/g:group/a:root/a:tested  ;

###############################################################################

curl -vs -XDELETE $NOTEX/api/attribute/g:group/a:root ;
curl -vs -XDELETE $NOTEX/api/group/g:group ;

###############################################################################
###############################################################################
