#!/bin/bash
###############################################################################
SCRIPT_PATH=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd) ;
###############################################################################

source ${SCRIPT_PATH}/conf/build.sh

###############################################################################
###############################################################################

function docker_build () {
    docker.io build --no-cache --rm -t ${1} .
}

function docker_run () {
    docker.io run --name ${1} -d -p ${2} ${3} ${@:5}
}

function docker_dev () {
    docker.io run --name ${1} -t -p ${2} ${3} ${@:5}
}

function docker_rm () {
    docker.io kill ${1} 2> /dev/null ;
    docker.io rm ${1} 2> /dev/null ;
}

###############################################################################
###############################################################################

case ${1} in

    all)
        git_archive ${GIT_REFNAME} && docker_build ${DEF_IMGNAME} && \
        docker_rm ${DEF_APPNAME} && git_clean ${GIT_REFNAME}
        docker_run ${DEF_APPNAME} ${DEF_PORTMAP} ${DEF_IMGNAME} $@ ;;
    build)
        docker_build ${DEF_IMGNAME} ;;
    rm)
        docker_rm ${DEF_APPNAME} ;;
    run)
        docker_run ${DEF_APPNAME} ${DEF_PORTMAP} ${DEF_IMGNAME} $@ ;;
    dev)
        docker_dev ${DEF_APPNAME} ${DEF_PORTMAP} ${DEF_IMGNAME} $@ ;;
    *)
        $0 all $@ ;;
esac

###############################################################################
###############################################################################

exit 0
