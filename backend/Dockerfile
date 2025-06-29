FROM node:18-alpine

WORKDIR /usr/src/app

# Add MySQL client
RUN apk add --no-cache mysql-client

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app files
COPY . .

# Copy and set permissions for start script
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 3000

# Use the start script as entrypoint
CMD ["sh", "start.sh"]
