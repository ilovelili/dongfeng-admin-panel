#!/bin/bash
set -e

echo "build"
npm run build -- --output-path=./dist/out --prod

echo "scp compiled files"
scp -r ./dist/out/* root@116.62.187.109:/var/www/dongfeng

echo "scp assets"
scp -r ./src/assets/img/* root@116.62.187.109:/root/dongfeng/img
scp -r ./src/assets/img/* root@116.62.187.109:/var/www/html/img

echo "done"