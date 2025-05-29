FROM cokoapps/base:20

RUN corepack enable

WORKDIR /home/node/app

COPY .yarnrc.yml .
COPY package.json .
COPY yarn.lock .

RUN yarn install --immutable && yarn cache clean && rm -rf ~/.npm && yarn cypress cache clear

# WORKDIR /home/node/app/packages/server
# COPY packages/server/.yarnrc.yml .
# COPY packages/server/package.json .
# COPY packages/server/yarn.lock .

WORKDIR /home/node/app/packages/client
COPY packages/client/.yarnrc.yml .
COPY packages/client/package.json .
COPY packages/client/yarn.lock .

# WORKDIR /home/node/app/packages/server
# RUN yarn install --immutable

WORKDIR /home/node/app/packages/client
RUN yarn install --immutable && yarn cache clean && rm -rf ~/.npm

WORKDIR /home/node/app

COPY . .
