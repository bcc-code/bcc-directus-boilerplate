#!/usr/bin/env bash

echo '=== running nodemon ==='

if [ -e start.mjs ]; then
  npx nodemon --inspect=0.0.0.0:9229 start.mjs
else
  echo "File start.mjs does not exists."
fi
