#!/usr/bin/env bash

echo '=== running nodemon ==='

if [ -e start.js ]; then
  npx nodemon --inspect=0.0.0.0:9229 start.js
else
  echo "File start.js does not exists."
fi
