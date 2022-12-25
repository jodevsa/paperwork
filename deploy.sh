#!/bin/bash


# rush deploy
node common/scripts/install-run-rush.js install
node common/scripts/install-run-rush.js build


echo "setting up pdfmaker"
mkdir -p ./build/pdfmaker
node common/scripts/install-run-rush.js deploy --project=pdfmaker -t ./build/pdfmaker --overwrite


mkdir -p ./build/config-service
echo "setting up config-service"
node common/scripts/install-run-rush.js deploy --project=config-service -t ./build/config-service --overwrite