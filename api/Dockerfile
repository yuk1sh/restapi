FROM node:16

WORKDIR /usr/src/app

# アプリケーションの依存関係をインストールする
COPY package.json ./package.json

RUN npm install

# アプリケーションのソースをバンドル
COPY . .

EXPOSE 4200
CMD [ "node", "app.js" ]