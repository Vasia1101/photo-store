FROM node:20-bookworm-slim

WORKDIR /app

# sharp needs build deps sometimes
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  libvips \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1337
CMD ["npm","run","develop"]
