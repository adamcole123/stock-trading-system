# build stage
FROM node:lts-alpine as build-stage
WORKDIR /home/node/app/frontend/

COPY package*.json ./

COPY tsconfig.json ./

COPY vue.config.js ./

COPY babel.config.js ./

COPY .prettierrc ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /home/node/app/frontend/dist /usr/share/nginx/html
COPY ./nginx.conf /temp/prod.conf
RUN envsubst /app < /temp/prod.conf > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]