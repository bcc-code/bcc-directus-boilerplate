FROM node as base

WORKDIR /home/node/app
COPY package*.json ./

RUN npm i

COPY . .

FROM base as production
ENV NODE_PATH=./
CMD ["directus", "start"]