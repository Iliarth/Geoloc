FROM node:alpine
RUN mkdir -p /geoloc
COPY . /geoloc
WORKDIR /geoloc
RUN npm i
RUN chown -R node:node /geoloc
USER node
EXPOSE 3000
CMD ["npm", "start"]