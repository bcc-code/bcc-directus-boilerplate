FROM node as base

WORKDIR /home/node/app
VOLUME ./shared:/home/node/app/shared:z
VOLUME ./src:/home/node/app/src:z
VOLUME ./extensions:/home/node/app/extensions:z

COPY *.json ./
COPY *.sh ./
RUN chmod +rwx run_nodemon.sh local_init.sh

RUN npm i

FROM base as production
ENV NODE_PATH=./