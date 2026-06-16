FROM node:alpine

WORKDIR /app/staff-portal

COPY ./package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "dev","--", "--host" ]