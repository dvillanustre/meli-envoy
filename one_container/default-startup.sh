#!/bin/bash 

COMPOSE_FILE='docker-compose.yml'
if [ -n "$OPTIONAL_COMPOSE_FILE" ]; then
	COMPOSE_FILE=$OPTIONAL_COMPOSE_FILE	
fi

echo 'Starting containers defined in '$COMPOSE_FILE
docker-compose rm -f
docker-compose -f $COMPOSE_FILE build
docker-compose -f $COMPOSE_FILE up --remove-orphans
rm http-middleware-repo
