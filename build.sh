#!/bin/bash

rm -rfv dist
mkdir dist

if [ ! -d ".git" ]; then
  mkdir .git
  echo "NOT RUNNING IN A CLONED REPO... CREATING FAKE .git DIR"
fi

docker compose -f build.docker-compose.yml up --force-recreate --remove-orphans --always-recreate-deps --renew-anon-volumes --build
