NODE_VERSION=16 #TODO: Replace it
SSH_PATH="$HOME/.ssh"

docker run --rm -v "$(pwd):/var/app" -v "${SSH_PATH}:/root/.ssh" node:${NODE_VERSION} bash -c "apt-get update && apt-get install rsync jq -y && cd /var/app && ci/deploy.sh"