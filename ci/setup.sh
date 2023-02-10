#!/bin/bash

set -e

HOST_USER="linhhta" #TODO: Replace it 
HOSTS=("rs-slave-1" "rs-slave-2")
NODE_VERSION="v16"

for host in ${HOSTS[*]}; do
    ssh "$host" 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash'
    ssh "$host" 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"'
    ssh "$host" "nvm install ${NODE_VERSION} && nvm alias default ${NODE_VERSION} && nvm use ${NODE_VERSION}"
    ssh "$host" "npm install -g pm2 && npm install -g yarn"
done