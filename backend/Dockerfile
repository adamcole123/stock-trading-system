FROM node:14.15.4

WORKDIR /home/node/app/backend/

COPY package*.json ./

COPY nodemon.json ./

COPY jest.config.ts ./

COPY .env ./

RUN npm i

CMD ["npm", "start"]
