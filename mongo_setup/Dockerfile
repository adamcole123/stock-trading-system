# Use the mongo:4.4-bionic image as the base image
FROM mongo:4.4-bionic

# Copy the mongo_setup.sh script into the Docker image
COPY mongo_setup.sh /scripts/mongo_setup.sh

# Make the mongo_setup.sh script executable
RUN chmod +x /scripts/mongo_setup.sh