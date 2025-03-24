FROM node:23-alpine AS build

# ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

COPY ./.env .

RUN npm install --force

RUN npm rebuild rollup

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]