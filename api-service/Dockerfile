# Use official Node.js image as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the container
COPY . .

# Expose the port the app will run on
EXPOSE 5050

# Start the app with ts-node-dev for hot-reloading
CMD ["npm", "run", "start"]
