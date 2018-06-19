#!/bin/bash

## redirecting all port 80 http traffic to the interceptor
sleep 5

HTTP_MIDDLEWARE_IP=$(ping -c 1 http-middleware | grep "64 bytes from " | awk '{print $5}' | cut -d":" -f1)
HTTP_MIDDLEWARE_IP=${HTTP_MIDDLEWARE_IP#"("}
HTTP_MIDDLEWARE_IP=${HTTP_MIDDLEWARE_IP%")"}

echo $HTTP_MIDDLEWARE_IP

iptables -t nat -I OUTPUT -p tcp --dport 80 -j DNAT --to-destination $HTTP_MIDDLEWARE_IP:80
#iptables -t nat -I PREROUTING -p tcp --dport 8080 -j DNAT --to-destination $HTTP_MIDDLEWARE_IP:3128

node /code/api/api.js
