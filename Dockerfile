# Use the official Node image, LTS version
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files (if available) first
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy the entire source code
COPY . .

# Expose the port used by the application
EXPOSE 3000

# Run the application
CMD ["npm", "run", "server"]
