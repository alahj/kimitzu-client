FROM ubuntu:18.04

USER root
RUN dpkg --add-architecture i386 

# Install Build Dependencies
RUN apt-get update
RUN apt-get install ca-certificates apt-transport-https wget gnupg2 curl build-essential git software-properties-common xvfb libgtk-3-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 gnupg-agent -y

RUN \
  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list

# Install chrome, nodejs, yarn, snapcraft
RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
RUN apt-get install -y google-chrome-stable nodejs snapcraft
RUN rm -rf /var/lib/apt/lists/*
RUN npm install -g yarn

# Install golang
# RUN wget https://storage.googleapis.com/golang/go1.12.4.linux-amd64.tar.gz
# RUN tar -zxvf go1.12.4.linux-amd64.tar.gz -C /usr/local/

# Go ENV settings
# ENV GOPATH /go
# ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH
# RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"
# RUN go get -u github.com/gobuffalo/packr/v2/packr2
# RUN go get -u -v github.com/kimitzu/kimitzu-go
# RUN go get -u -v github.com/kimitzu/kimitzu-services

# "fake" dbus address to prevent errors
# https://github.com/SeleniumHQ/docker-selenium/issues/87
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null

# versions of local tools
RUN echo  " node version:    $(node -v) \n" \
  "npm version:     $(npm -v) \n" \
  "yarn version:    $(yarn -v) \n" \
  "debian version:  $(cat /etc/debian_version) \n" \
  "Chrome version:  $(google-chrome --version) \n" \
  "git version:     $(git --version) \n"

# a few environment variables to make NPM installs easier
# good colors for most applications
ENV TERM xterm
# avoid million NPM install messages
ENV npm_config_loglevel warn
# allow installing when the main user is root
ENV npm_config_unsafe_perm true