FROM node:23-alpine AS build

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install --force

RUN npm rebuild rollup

COPY . .

# Set the environment variable in the container

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]