#!/bin/bash
set -e

echo "build"
npm run build -- --output-path=./dist/out --environment prod

echo "scp compiled files"
scp -r ./dist/out/* root@47.110.143.96:/var/www/dongfeng

echo "scp assets"
scp -r ./src/assets/img/* root@47.110.143.96:/root/dongfeng/img
scp -r ./src/assets/img/* root@47.110.143.96:/var/www/html/img

echo "done"