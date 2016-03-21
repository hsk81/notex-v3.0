#!/bin/bash
###############################################################################

function DELETE {
    function join { local IFS="$1"; shift; echo "$*"; }
    function oche { if [[ $? -eq 0 ]] ; then echo ; else exit -1 ; fi }

    path="${1}" ;

    IFS='/' read -ra PARTS <<< ${path}
    HEAD=${PARTS[0]}; TAIL=${PARTS[@]:1}
    echo -n ${HEAD} | tr '[:lower:]' '[:upper:]'
    echo ':' $(join "/" ${TAIL[@]:2})

    curl -vs -XDELETE $NOTEX/api/${path} ;
    if [[ $? -eq 0 ]] ; then echo ; else exit -1 ; fi
}

###############################################################################
###############################################################################
