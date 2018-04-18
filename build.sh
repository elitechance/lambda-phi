#!/bin/sh
./node_modules/.bin/tsc
cp package.json README.md CHANGELOG.md dist/
