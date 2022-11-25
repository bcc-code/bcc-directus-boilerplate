#!/usr/bin/env bash

echo '=== running nodemon ==='

if [ -e node_modules/directus/dist/start.js ]; then
  npx nodemon --inspect=0.0.0.0:9229 node_modules/directus/dist/start.js
else
  echo "File node_modules/directus/dist/start.js does not exists."
fi
