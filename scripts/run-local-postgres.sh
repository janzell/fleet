#!/usr/bin/env bash

# Get environment variables
source .env

# Run postgres
docker run -d -p 5001:5432 \
    --name fleet-postgres \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e POSTGRES_DB=$POSTGRES_DB \
    postgres:11
