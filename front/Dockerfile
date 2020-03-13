FROM node:12.16.1

WORKDIR /app/front

ENV PATH /app/front/node_modules/.bin:$PATH

COPY package.json /app/front/package.json
COPY package-lock.json /app/front/package-lock.json
RUN npm install
RUN npm rebuild node-sass

CMD ["npm", "start"]