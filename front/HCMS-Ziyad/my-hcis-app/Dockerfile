FROM node:23-alpine AS build

# ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install --force

RUN npm rebuild rollup

COPY . .

# Set the environment variable in the container
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]