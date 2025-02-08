FROM node

WORKDIR /app

COPY package*.json .
COPY bin ./bin
COPY routes ./routes
COPY app.js .

RUN npm install

EXPOSE 5000

CMD ["node", "./bin/www"]
