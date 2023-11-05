FROM node:16 

RUN mkdir /home/buildp

ADD .git/ /home/buildp/.git/
ADD package.json /home/buildp/package.json
ADD package-lock.json /home/buildp/package-lock.json
ADD tsconfig.* /home/buildp/
ADD webpack.* /home/buildp/
ADD LICENSE /home/buildp/LICENSE
ADD README.md /home/buildp/README.md
ADD PrivacyPolicy.md /home/buildp/PrivacyPolicy.md
ADD scipts/ /home/buildp/scipts/
ADD src/ /home/buildp/src/
ADD build.* /home/buildp/

RUN apt-get update && apt-get install -y curl git wget unzip jq zip

WORKDIR /home/buildp

CMD bash scipts/build-package.sh