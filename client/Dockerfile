FROM node:alpine
WORKDIR /app
COPY ../package*.json .
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci

COPY . .
ARG VITE_API_ORIGIN
ARG VITE_API_PATH
RUN npm run build
EXPOSE 3000
CMD [ "npm run dev" ]