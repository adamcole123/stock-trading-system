FROM node:14.15.4

WORKDIR /home/node/app/frontend/

COPY package*.json ./

COPY tsconfig.json ./

RUN npm i

CMD ["npm", "run", "serve"]
