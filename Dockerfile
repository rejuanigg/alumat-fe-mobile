FROM node:22-bookworm

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci && npm install -g @expo/ngrok
COPY . .

EXPOSE 8081
CMD ["npx", "expo", "start", "--tunnel", "ngrok", "--port", "8081"]