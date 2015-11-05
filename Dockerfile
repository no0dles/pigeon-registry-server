FROM alpine

RUN apk add --update nodejs

# Bundle app source
COPY . /src

WORKDIR /src

# Install app dependencies
RUN cd /src;

EXPOSE  3000

CMD ["node", "/src/index.js"]