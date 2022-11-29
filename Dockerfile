FROM node as base

WORKDIR /home/node/app

COPY ./shared ./
COPY ./src ./
COPY ./extensions ./

COPY *.json ./
COPY *.sh ./

RUN chmod +rwx run_nodemon.sh local_init.sh

RUN npm i