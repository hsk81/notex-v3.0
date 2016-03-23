#!/bin/bash
###############################################################################
SCRIPT_PATH=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd) ;
###############################################################################

function clean_env () {
    rm -rf bin/ include/ lib/ share/
}

function clean_egg () {
    rm -rf build/ dist/ *.egg-info/
}

function clean_pyc () {
    rm -rf $(tree -fi | grep \\.pyc$)
}

function clean_log () {
    rm -rf $(tree -fi | grep \\.log$)
}

###############################################################################
###############################################################################

case ${1} in

    all)
        clean_env && clean_egg && clean_pyc && clean_log ;;
    env)
        clean_env ;;
    egg)
        clean_egg ;;
    pyc)
        clean_pyc ;;
    log)
        clean_log ;;
    *)
        $0 all ;;
esac

###############################################################################
###############################################################################

exit 0
