# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.2.0

FROM node:${NODE_VERSION}-alpine as base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN ls -al    # Debug: List files in the working directory
# RUN cat package.json  
EXPOSE 58669

FROM base as dev
ENV NODE_ENV development

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
    
USER node

COPY . .
CMD npm run dev

FROM base as prod
ENV NODE_ENV production
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --only=production
USER node
COPY . .
CMD node src/index.js
