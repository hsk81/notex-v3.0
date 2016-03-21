#!/bin/bash
###############################################################################

function CREATE {
    function join { local IFS="$1"; shift; echo "$*"; }
    function oche { if [[ $? -eq 0 ]] ; then echo ; else exit -1 ; fi }

    path="${1}" ;
    data="${2}" ;

    IFS='/' read -ra PARTS <<< ${path}
    HEAD=${PARTS[0]}; TAIL=${PARTS[@]:1}
    echo -n ${HEAD} | tr '[:lower:]' '[:upper:]'
    echo ':' $(join "/" ${TAIL[@]:2})

    curl -vs -XPOST $NOTEX/api/${path} \
         -d"${data}" -H"content-type:application/json" ;

    if [[ $? -eq 0 ]] ; then echo ; else exit -1 ; fi
}

###############################################################################
###############################################################################
