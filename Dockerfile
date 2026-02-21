FROM node:20-alpine AS build
WORKDIR /app

# Download fonts
RUN apk add --no-cache curl && \
    mkdir -p fonts && \
    curl -sL -o fonts/ArchivoBlack-Regular.ttf "https://github.com/google/fonts/raw/main/ofl/archivoblack/ArchivoBlack-Regular.ttf" && \
    curl -sL -o fonts/CourierPrime-Regular.ttf "https://github.com/google/fonts/raw/main/ofl/courierprime/CourierPrime-Regular.ttf"

COPY package.json .
RUN npm install --production

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/fonts ./fonts
COPY package.json server.js ./

EXPOSE 6000
CMD ["node", "server.js"]
