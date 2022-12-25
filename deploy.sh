#!/bin/bash


# rush deploy
node common/scripts/install-run-rush.js install
node common/scripts/install-run-rush.js build


echo "setting up pdf-service"
mkdir -p ./build/pdf-service
node common/scripts/install-run-rush.js deploy --project=pdf-service -t ./build/pdf-service --overwrite


mkdir -p ./build/config-service
echo "setting up config-service"
node common/scripts/install-run-rush.js deploy --project=config-service -t ./build/config-service --overwrite



mkdir -p ./build/user-service
echo "setting up user-service"
node common/scripts/install-run-rush.js deploy --project=user-service -t ./build/user-service --overwrite