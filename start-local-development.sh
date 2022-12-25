#!/bin/bash

# start minkube
minikube start

# enable nginx ingress
minikube addons enable ingress

# wait for nginx ingress to be ready
sleep 5

# create namespace
kubectl create namespace pdfmaker-dev

# apply resources
kubectl apply -k ./kubernetes/minikube/

# tunnel ingress (80, 443)
minikube tunnel