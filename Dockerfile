FROM node:20.5.1-alpine

WORKDIR /transaction

COPY . .

COPY package*.json ./

RUN npm cache clean --force
RUN npm install -g @nestjs/cli argon2 ts-node rimraf

RUN npm install
RUN yarn build

CMD ["yarn", "start:prod"]