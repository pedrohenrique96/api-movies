FROM node:14-alpine


WORKDIR /usr/src/app

RUN npm install global yarn

CMD yarn start:docker:dev