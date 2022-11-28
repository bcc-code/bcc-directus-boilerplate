FROM node as base

WORKDIR /home/node/app
COPY package*.json ./

RUN npm i

COPY *.sh ./
COPY *.json ./

RUN chmod +rwx run_nodemon.sh local_init.sh

FROM base as production
ENV NODE_PATH=./