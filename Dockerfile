FROM node:current

WORKDIR /workspace

RUN apt update

COPY . .

CMD ["node", "."]