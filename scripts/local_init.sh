#!/usr/bin/env bash

echo '=== locking custom migrations ==='
mv ./extensions/migrations ./extensions/migrations-lock

echo '=== bootstrapping directus ==='
npx directus bootstrap --skipAdminInit

echo '=== syncing schema and collections ==='
npx directus schema-sync install
npx directus schema-sync import || {
    echo '=== Error syncing. Unlocking custom migrations ==='
    mv ./extensions/migrations-lock ./extensions/migrations
    exit 1;
}

echo '=== unlocking custom migrations ==='
mv ./extensions/migrations-lock ./extensions/migrations

echo '=== applying custom migrations ==='
npx directus database migrate:latest