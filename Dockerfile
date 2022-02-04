FROM node:16-alpine3.15 as builder

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN ls -a
RUN npm install
RUN npm run build


RUN ["npm", "ci", "--production"]
COPY . ./
RUN npm run build


FROM node:16-alpine3.15 as runner

WORKDIR /app

COPY package.json ./
RUN npm install --only=production

COPY --from=builder /app/build /app/build
RUN npm i -g pm2
EXPOSE 3000
CMD ["pm2-runtime", "build/servet.js"]