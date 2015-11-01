FROM alpine

RUN apk add --update nodejs

# Bundle app source
COPY . /src

WORKDIR /src

# Install app dependencies
RUN cd /src; npm install --production

EXPOSE  3000

CMD ["node", "/src/index.js"]