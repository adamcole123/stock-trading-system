FROM node:14.15.4

WORKDIR /home/node/app/backend/

COPY package*.json ./

COPY nodemon.json ./

COPY .env ./

RUN npm i --legacy-peer-deps

CMD ["npm", "run", "dockerstart"]
