FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN chmod +x wait-for.sh

EXPOSE 3333
EXPOSE 5555

CMD ["./wait-for.sh", "db:5432", "--", "sh", "-c", "npx prisma migrate deploy && yarn start"]