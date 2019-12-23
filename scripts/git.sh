#!/bin/bash
###############################################################################
SCRIPT_PATH=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd) ;
###############################################################################

function git_archive () {
    rm -f ${1}.zip && git archive -o ${1}.zip ${1}
}

function git_archive_rm () {
    rm -f ${1}.zip
}

###############################################################################
###############################################################################

case ${1} in
    git-archive)
        git_archive HEAD ;;
    git-archive-rm)
        git_archive_rm HEAD ;;
    git-submodule-update)
        git submodule update --init ;;
esac

###############################################################################
###############################################################################

exit 0
