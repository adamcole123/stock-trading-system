FROM mongo

# Create app directory
WORKDIR /usr/mongo-seed/configs

#Install app dependencies
COPY replicaSet.js .
COPY setup.sh .

ENTRYPOINT [ "/bin/bash" ]
CMD ["./setup.sh"]