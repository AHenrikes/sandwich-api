#FROM node:version...
FROM node:latest

# Set working directory
WORKDIR /src/app/

# Copy necessary files
COPY ./utils/wait-for-it.sh ./utils/
COPY . .

# Make wait-for-it.sh executable
RUN chmod +x ./utils/wait-for-it.sh

# Install dependencies
RUN npm install

# CMD ["package.json", "scripts"]
CMD [ "node", "index.js" ]
