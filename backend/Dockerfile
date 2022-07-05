FROM node:14

WORKDIR /carpick/
COPY ./package.json /carpick/
COPY ./yarn.lock /carpick/
RUN yarn install

COPY . /carpick/
CMD yarn start:dev

# RUN yarn build
# CMD yarn start:prod