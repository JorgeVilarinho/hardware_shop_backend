FROM node

WORKDIR /app

COPY ./package.json /app

RUN npm install

COPY ./dist /app

EXPOSE 8080

CMD ["node","index.js"]