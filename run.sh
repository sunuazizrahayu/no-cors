#!/bin/bash
docker run --rm -it -v=$(pwd):/app -w=/app --user $(id -u):$(id -g) \
	-p 0.0.0.0:3000:3000 \
	node:22-alpine "$@"
