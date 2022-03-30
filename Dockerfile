FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm

RUN apt-get install -y curl

RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest

WORKDIR /app

RUN pip install 'tts==0.4.1'

RUN apt-get install libsndfile1 -y

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . ./

RUN mkdir audio

RUN npm run build

CMD [ "npm", "run", "prod" ]