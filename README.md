# Directus app boilerplate

A boilerplate for using Directus with best practices inside BCC.

## Setup locally

1. Clone the repo
2. Create `.env` file. You can copy example by `cp env.example .env`
3. Install dependencies by `npm install`
4. Run services by `docker compose up -d`
5. When you run application for the first time, run `npm run init`. 
6. After this action, it may be necessary to restart the container with the application, you can use `docker restart directus-app`

## Documentation

### Auto swagger documentation for custom endpoints

... 