FROM ubuntu
FROM node

# INSTALL PACKAGES
RUN apt -yqq update \
    && apt -yqq install git curl \
    && apt clean \

# INSTALL YARN
RUN corepack enable
RUN yarn init -2

# CHECKOUT
# Определяем аргумент сборки с дефолтным значением 'dev'
ARG BRANCH=dev
RUN git clone https://github.com/uniteam31/jenkins-test.git # !!! editable
WORKDIR /jenkins-test
RUN git fetch --all
RUN git pull
RUN git checkout ${BRANCH}

# INSTALL DEPS
WORKDIR /jenkins-test
RUN yarn install
RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]
