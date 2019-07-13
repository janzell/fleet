#! /bin/bash

# Update the environment
source .env

# Run cleanup first
echo "Clean up..."
./scripts/destroy-hasura.sh

# Run docker container
if [ ! -z "$LOCAL" ] && [ $LOCAL = true ]
then

# Check if database is running
POSTGRES_STATUS=$(docker inspect -f "{{.State.Running}}" fleet-postgres)

# Run if its not running
if  [ -z "$POSTGRES_STATUS" ] || [ $POSTGRES_STATUS = false ]
then
    echo -e "Spawning postgres for the first time"
    ./scripts/run-local-postgres.sh
    sleep 5
else
    echo "POSTGRES is running"
fi

echo -e "\nConnecting to [LOCAL] postgres"
echo -e "Connecting to database: postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@postgres/$POSTGRES_DB \n"

echo "Docker container ID:"
docker run -d -p 8080:8080 \
       --name fleet-hasura \
       --link fleet-postgres:postgres \
       -e HASURA_GRAPHQL_DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@postgres/$POSTGRES_DB \
       -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
       -e HASURA_GRAPHQL_ENABLE_TELEMETRY=false \
       -e HASURA_GRAPHQL_CORS_DOMAIN="*" \
       -e HASURA_GRAPHQL_ADMIN_SECRET=cleanfuel2019 \
       -e HASURA_GRAPHQL_JWT_SECRET="{\"type\":\"HS256\",\"key\":\"gKWxz7NlJlFvQfHjuGTG37s43IQzbizRSn7GooIhiw0bLdcBr7TqDANGf2pHUs0p\"}" \
       hasura/graphql-engine:v1.0.0-beta.2
else
echo "Connecting to [PROD] database"
echo -e "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/$POSTGRES_DB \n"

#
#       -e HASURA_GRAPHQL_ADMIN_SECRET=6yhn7ujm8ik, \
#       -e HASURA_GRAPHQL_ACCESS_KEY=1qaz2wsx3edc \

echo "Docker container ID:"
docker run -d -p 8080:8080 \
       --name fleet-hasura \
       -e HASURA_GRAPHQL_DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/$POSTGRES_DB \
       -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
       -e HASURA_GRAPHQL_ENABLE_TELEMETRY=false \
       -e HASURA_GRAPHQL_ADMIN_SECRET=cleanfuel2019 \
       -e HASURA_GRAPHQL_JWT_SECRET="{\"type\":\"HS256\",\"key\":\"gKWxz7NlJlFvQfHjuGTG37s43IQzbizRSn7GooIhiw0bLdcBr7TqDANGf2pHUs0p\"}" \
       -e HASURA_GRAPHQL_CORS_DOMAIN="*" \
       hasura/graphql-engine:v1.0.0-beta.2
fi

# Add this delay for docker container to give the status
sleep 3

# Get the status of the container
STATUS=$(docker inspect -f "{{.State.Running}}" fleet-hasura)


if [ $STATUS = true ]
then
    echo -e "\nConnection successful..."
else
    echo -e "\nPlease check connection to the database. Check if it is running."
    if [ ! -z "$LOCAL" ] && [ $LOCAL = true ]
    then
        echo -e "If running locally. Execute ./scripts/run-local-postgres.sh first."
    else
        echo -e "If running in production check if you have the rights to connect to the postgres database."
    fi
fi
