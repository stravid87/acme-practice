# Use a slim version of Node for a smaller footprint
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose the port (3003 for backend, 3002 for reverse, 3001 for forward)
# Note: This is mostly for documentation; K8s uses Service definitions
EXPOSE 3002

CMD [ "node", "index.js" ]