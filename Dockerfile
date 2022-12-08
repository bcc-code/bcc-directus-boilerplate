FROM node:slim as base

WORKDIR /home/node/app

COPY ./shared ./shared
COPY ./src ./src
COPY ./extensions ./extensions

COPY *.json ./
COPY *.sh ./

RUN chmod +rwx run_nodemon.sh local_init.sh

RUN npm i