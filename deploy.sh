#!/bin/bash
set -e

echo "build"
npm run build -- --output-path=./dist/out --environment prod

echo "scp"
scp -r ./dist/out root@47.110.143.96:/var/www/dongfeng

echo "done"