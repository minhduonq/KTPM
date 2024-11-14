FROM node:22
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
CMD ["node", "index.js"]
EXPOSE 8080