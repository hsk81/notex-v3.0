#!/bin/bash
###############################################################################
SCRIPT_PATH=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd) ;
###############################################################################

function setup_env () {
    if [ $VIRTUAL_ENV ] ; then
        exit 0
    else
        if [ $PY3 ] ; then
            virtualenv . --prompt="[$1] " --python=/usr/bin/python3
        elif [ $PY2 ] ; then
            virtualenv . --prompt="[$1] " --python=/usr/bin/python2
        else
            virtualenv . --prompt="[$1] " --python=/usr/bin/python
        fi
    fi
}

function pip_update () {
    if [ ${VIRTUAL_ENV} ] ; then
        for LIB in $(pip list | cut -d' ' -f1) ; do
            pip install --upgrade $LIB
        done
    fi
}

function clean_env () {
    rm -rf bin/ include/ lib/ share/
}

function clean_egg () {
    rm -rf build/ dist/ *.egg-info/
}

function clean_pyc () {
    rm -rf $(tree -fi | grep __pycache__$)
    rm -rf $(tree -fi | grep \\.pyc$)
}

function clean_log () {
    rm -rf $(tree -fi | grep \\.log$)
}

###############################################################################
###############################################################################

case ${1} in
    clean)
        clean_env && clean_egg && clean_pyc && clean_log ;;
    init)
        setup_env "notex" ;;
    pip-update)
        pip_update ;;
    *)
        $0 init $1 $2 ;;
esac

###############################################################################
###############################################################################

exit 0
