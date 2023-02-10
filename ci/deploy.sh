#!/bin/bash

set -e

HOST_USER="linhhta" #TODO: Replace it 
GIT_URL="git@github.com:rising-stars-vn/rs-22-team-1-linhhta.git" #TODO: Replace it
BRANCH="${@:-main}"
ECHO_FILE_PATH="$(pwd)/ci/ecosystem.config.js"
ENV_FILE="$(pwd)/ci/env.json"
# HOSTS=("rs-slave-1" "rs-slave-2")
HOSTS=("rs-slave-1")
TMP_PATH="$(pwd)/.tmp/"
VERSION=$(date '+%Y%m%d%H%M%S')
HOST_PATH="/home/${HOST_USER}"

echo ${TMP_PATH}

function predeploy {
  echo ">>> Run predeploy"
  for host in ${HOSTS[*]}; do
    ssh "$host" "mkdir -p ${HOST_PATH}/releases"
  done
}

function postdeploy {
  echo ">>> Run postdeploy"
  for host in ${HOSTS[*]}; do
    ssh "$host" "cd $HOST_PATH/releases && ls -1dt * | tail -n +2 | xargs rm -rf"
  done
}

function clean {
  rm -rf "${TMP_PATH}"
}

function build {
  echo ">>> Run build"
  git clone -b "${BRANCH}" "${GIT_URL}" "${TMP_PATH}"
  cd "${TMP_PATH}"
  cp .env.example .env
  cat ${ENV_FILE} | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" | while read item;
  do
    arr=(${item//=/ })
    key=${arr[0]}
    value=${arr[1]}
    sed -i -e "s|^${key}=.*|${key}=\"${value}\"|g" .env
  done
  yarn install
  yarn run build
  rm -rf node_modules
}

function deploy {
  echo ">>> Run deploy"
  # Copy code to server
  for host in ${HOSTS[*]}; do
    rsync -r -z "${TMP_PATH}" "$host:/${HOST_PATH}/releases/${VERSION}/"
    ssh "$host" "cd /${HOST_PATH}/releases/${VERSION}/ && yarn install --production"
  done

  # Symlink to server and restart
  for host in ${HOSTS[*]}; do
    rsync "${ECHO_FILE_PATH}" "$host:/${HOST_PATH}/ecosystem.config.js"
    ssh "$host" "rm -f ${HOST_PATH}/current && ln -sf ${HOST_PATH}/releases/${VERSION} ${HOST_PATH}/current && pm2 restart ${HOST_PATH}/ecosystem.config.js --update-env && pm2 save"
  done
}

function main {
  clean
  build
  predeploy
  deploy
  postdeploy
  clean
}

main