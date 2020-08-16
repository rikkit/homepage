FROM node:12
RUN yarn global add package-json-merge

RUN mkdir /usr/src/frontend
WORKDIR /usr/src/frontend

COPY src/frontend/components components
COPY src/frontend/lib lib
COPY src/frontend/pages pages
COPY src/frontend/styles styles
COPY src/frontend/public public
COPY src/frontend/next-env.d.ts next-env.d.ts
COPY src/frontend/postcss.config.js postcss.config.js
COPY src/frontend/tsconfig.json tsconfig.json

COPY /src/frontend/package.json package.local.json
COPY package.json package.root.json
RUN package-json-merge package.local.json package.root.json > package.json

COPY yarn.lock yarn.lock
RUN yarn install

RUN yarn build

CMD ["yarn", "dev"]
