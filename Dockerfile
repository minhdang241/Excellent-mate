# Use the official Node.js 14 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install the dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Expose a port (replace 3000 with the appropriate port for your application)
EXPOSE 3000

# Start the application
CMD [ "node", "app.js" ]