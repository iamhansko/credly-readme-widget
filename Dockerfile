FROM node:alpine

WORKDIR /app

RUN apk add --no-cache \
    msttcorefonts-installer font-noto fontconfig \
    freetype ttf-dejavu ttf-droid ttf-freefont ttf-liberation \
    chromium \
    && rm -rf /var/cache/apk/* /tmp/*
RUN update-ms-fonts && fc-cache -f
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

ENV CONTAINER_RUNTIME docker

COPY package*.json .
COPY bin ./bin
COPY routes ./routes
COPY app.js .

RUN npm install

EXPOSE 5000

CMD ["node", "./bin/www"]
