FROM mongo

WORKDIR /usr/mongo-seed/configs

COPY mongo.conf .
COPY MOCK_DATA.csv .

EXPOSE 27017

CMD ["--config", "./mongo.conf"]