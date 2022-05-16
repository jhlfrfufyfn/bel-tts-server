FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm

RUN apt-get install -y curl

RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest

WORKDIR /app

RUN apt-get install libsndfile1 -y

RUN git clone -b deployment --single-branch https://github.com/jhlfrfufyfn/bel-tts.git

RUN cd bel-tts && make install && cd ..

COPY package*.json ./

RUN npm install

COPY . ./

RUN mkdir audio

CMD [ "npm", "run", "dev" ]