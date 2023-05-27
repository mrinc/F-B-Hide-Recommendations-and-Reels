#!/bin/bash

rm -rfv dist
mkdir dist

docker compose -f build.docker-compose.yml up --force-recreate --remove-orphans --always-recreate-deps --renew-anon-volumes --build
