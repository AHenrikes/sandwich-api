FROM node:latest

WORKDIR /Next-docker/

COPY . .

RUN npm install

ENV NEXT_PUBLIC_APP_SERVER_A_URL="http://localhost:8080"

CMD ["npm", "run", "dev"]
