FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

ENV PORT=3000
# Must start with mongodb://, "" can be removed.
ENV MONGODB_URL=""
# The rest of the ENV variables do require "".
ENV JWT_SECRET=""
ENV FIREBASE_DB_URL=""
ENV VAPID_PUBLICKEY=""
ENV VAPID_PRIVATEKEY=""
ENV VAPID_EMAIL=""

ENV PROJECT_ID=""
ENV PRIVATE_KEY=""
ENV CLIENT_EMAIL=""

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]