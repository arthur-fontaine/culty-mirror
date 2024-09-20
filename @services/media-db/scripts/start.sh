#!/bin/bash

CONTAINER_NAME=typesense_container

# Check if the container is already running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Container $CONTAINER_NAME is already running."
else
    # Check if the container exists but is not running
    if [ "$(docker ps -aq -f status=exited -f name=$CONTAINER_NAME)" ]; then
        echo "Starting existing container $CONTAINER_NAME."
        docker start $CONTAINER_NAME --attach
    else
        echo "Creating and starting new container $CONTAINER_NAME."
        docker run --name $CONTAINER_NAME -p 8108:$TYPESENSE_PORT \
            -v $TYPESENSE_DATA_DIR:/data \
            typesense/typesense:27.0 \
            --data-dir /data \
            --api-key=$TYPESENSE_KEY \
            --enable-cors
    fi
fi
