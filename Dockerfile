# build environment
FROM node:14.18.0 as builder
ENV PATH /app/node_modules/.bin:$PATH
ENV ADBLOCK 1
ENV OPEN_SOURCE_CONTRIBUTOR true
ENV DISABLE_OPENCOLLECTIVE true
COPY package.json /tmp/package.json
COPY package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir /app && cp -a /tmp/node_modules /app && cp /tmp/package.json /app/package.json


# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /app
COPY . /app
RUN npm run build

# production environment
FROM node:14.18.0
WORKDIR /app/
COPY --from=builder /app/   /app/
ENV TZ=Europe/Helsinki
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD ["npm", "run", "start_prod"]