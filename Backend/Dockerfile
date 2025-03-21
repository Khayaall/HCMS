# Use a lightweight Node.js image for production
FROM node:23-alpine 

# Set environment variables for production
# ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install production dependencies only
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your backend runs on
EXPOSE 5000


# Start the backend application
CMD ["node", "index.js"]  