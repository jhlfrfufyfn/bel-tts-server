FROM python:3.9-slim as builder

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

RUN ["npm", "ci", "--production"]

COPY . ./

RUN mkdir audio

CMD [ "npm", "run", "dev" ]


FROM builder as runner

WORKDIR /app

COPY package.json ./
RUN npm install --only=production

COPY --from=builder /app/build /app/build
COPY --from=builder /app/static /app/static
COPY --from=builder /app/tts-config /app/tts-config

RUN npm i -g pm2
EXPOSE 3000
CMD ["npm", "run", "dev"]