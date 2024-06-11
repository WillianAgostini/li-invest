# Build stage
FROM node:lts-alpine AS builder

# Install necessary packages for Puppeteer in build image
RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

USER node
WORKDIR /home/node
 
COPY package*.json ./
RUN npm ci
 
COPY --chown=node:node . .
RUN npm run build && npm prune --omit=dev
 
 
# Final run stage
FROM node:lts-alpine

# Install necessary packages for Puppeteer in runtime image
RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
 
ENV NODE_ENV production
USER node
WORKDIR /home/node
 
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules ./node_modules
COPY --from=builder --chown=node:node /home/node/dist ./dist

ARG PORT
EXPOSE ${PORT:-3000}
 
CMD ["node", "dist/main.js"]