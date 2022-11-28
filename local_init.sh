#!/usr/bin/env bash

#ask_for_user() {
#  echo '=== asking for new admin user ==='
#
#  while true; do
#    read -p "Do you want to create an admin user? [y/n]? " yn
#    case $yn in
#    [Yy]*)
#      create_user
#      break
#      ;;
#    [Nn]*) exit ;;
#    *) echo "Please answer Y or N." ;;
#    esac
#  done
#}
#
#create_user() {
#  echo '=== creating new admin user ==='
## UPDATE THE FOLLOWING WITH ROLE ID FOR ADMINISTRATOR AS FOUND IN config/roles.yaml
#  role="7f2ff228-0a9b-41ad-b057-5b784109c97a"
#  echo 'Enter email'
#  read email
#  echo 'Enter password'
#  read password
#
#  npx directus users create --role $role --email "$email" --password "$password"
#}

echo '=== locking custom migrations ==='
mv ./extensions/migrations ./extensions/migrations-lock

echo '=== bootstrapping directus ==='
npx directus bootstrap

echo '=== applying schema ==='
npx directus schema apply ./schema.yaml --yes

echo '=== unlocking custom migrations ==='
mv ./extensions/migrations-lock ./extensions/migrations

echo '=== applying custom migrations ==='
npx directus database migrate:latest

echo '=== asking for rbac rules import ==='
while true; do
  read -p "Do you have rbac rules to import? [y/n]? " yn
  case $yn in
  [Yy]*)
    npx directus rbac import
#    ask_for_user
    break
    ;;
  [Nn]*) exit ;;
  *) echo "Please answer Y or N." ;;
  esac
done