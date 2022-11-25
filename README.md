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

The swagger documentation generated by `directus` does not contain custom endpoints. In the project, we use the `tsoa` library to generate swagger documentation for our public api.

#### Usage

To generate `docs/swagger.json` run `tsoa spec`.

#### Convention

- Create `exampleService.ts` which extends `ItemsService`
- Create `exampleController.ts` with injected `exampleService.ts`. Controller should contains tsoa annotations
- Create `index.ts` file to register custom directus endpoints. There you can add endpoint, create controller instance and execute the desired method.

#### Important

There is a problem with `@Query` annotation when query is an object. In that case just use `@Inject`, but your query will not be in the documentation.