docker run -p 8108:$TYPESENSE_PORT \
    -v $TYPESENSE_DATA_DIR:/data\
    typesense/typesense:27.0 \
    --data-dir /data \
    --api-key=$TYPESENSE_KEY \
    --enable-cors
