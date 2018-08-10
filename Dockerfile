# NOTE: This must be executed from the root repo directory
#       You must copy your ~/.npmrc file into the root repo directory first
#       (https://palringo.atlassian.net/wiki/display/AR/NPM+Repository+Service)
#
#
#   eg: cp ~/.npmrc .
#       docker build -f service-template/Dockerfile  -t service-template .

# NOTE: This can be ran to run the build above
#   eg: docker run  -it service-template
FROM node:8.4.0

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Copy info used by npm install
COPY .npmrc .npmrc

# Bundle app source
COPY service-template/. /usr/src/app

#Install dependencies
RUN npm install

#Run tests
#RUN npm test

#Remove info so it is not in container
RUN rm -f .npmrc

CMD [ "node", "app.js" ]
