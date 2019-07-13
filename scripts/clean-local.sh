#!/usr/bin/env bash
echo "Cleaning up..."

./scripts/destroy-hasura.sh
./scripts/destroy-local-postgres.sh

echo "Done cleaning."
