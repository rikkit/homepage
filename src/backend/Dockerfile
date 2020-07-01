FROM node:12
RUN yarn global add package-json-merge

RUN mkdir /usr/src/backend
WORKDIR /usr/src/backend

COPY /src/backend/api api
COPY /src/backend/config config
COPY /src/backend/extensions extensions
COPY /src/backend/favicon.ico favicon.ico

COPY /src/backend/package.json package.local.json
COPY package.json package.root.json
RUN package-json-merge package.local.json package.root.json > package.json

COPY yarn.lock yarn.lock
RUN yarn install

CMD ["yarn", "dev"]
