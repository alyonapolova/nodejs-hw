FROM node:16

WORKDIR /app

ENV NODE_ENV=test

COPY . .

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start:dev" ]