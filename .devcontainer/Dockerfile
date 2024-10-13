FROM ubuntu:latest

# Set environment variables to prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install node and yarn
RUN apt install -y git vim wget && \
    touch ~/.bashrc && \
    chmod +x ~/.bashrc && \
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    . ~/.bashrc && \
    nvm install --lts && \
    npm install --global yarn

# # Install Leaflet, d3 and d3-hexbin via Yarn or npm
# RUN npm install leaflet d3 d3-hexbin

# Make terminal nicer
RUN echo 'LC_ALL="C.UTF-8"' >> /root/.bash_profile && \
    echo 'PS1="\[\033[01;32m\]\u\[\033[00m\] ➜ \[\033[01;34m\]\W\[\033[00m\] \[\033[01;31m\](\h)\[\033[00m\] $ "' >> /root/.bash_profile
