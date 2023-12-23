FROM node:latest

WORKDIR /app

ENV NODE_ENV=test

COPY package*.json .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run", "start" ]

# FROM node:16

# WORKDIR /app

# COPY . .

# RUN npm install

# EXPOSE 3000

# ENTRYPOINT [ "npm", "run", "start:dev" ]