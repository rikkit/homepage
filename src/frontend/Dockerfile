FROM node:12
RUN yarn global add package-json-merge

ARG API_URL
ENV API_URL "$API_URL"
ARG STRAPI_PREVIEW_SECRET
ENV STRAPI_PREVIEW_SECRET "$STRAPI_PREVIEW_SECRET"
ARG WEB_URL
ENV WEB_URL "$WEB_URL"

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
