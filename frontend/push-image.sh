#!/bin/sh

# Tag the image
docker tag frontend:0.0.1 http://propheticruqyah.com:5000/frontend:0.0.1

# Push the image
docker push http://propheticruqyah.com:5000/frontend:0.0.1
