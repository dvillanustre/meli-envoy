#Run:
1- cd infrastructure
2- ./startup.sh

#Check transparent proxy:
1- docker exec -it infrastructure_application_1 curl -v another-api:80/ping
2- check errors:

> GET /ping HTTP/1.1
> User-Agent: curl/7.38.0
> Host: another-api
> Accept: */*
> 
< HTTP/1.1 503 Service Unavailable
< content-length: 57
< content-type: text/plain
< date: Tue, 19 Jun 2018 15:21:29 GMT
* Server envoy is not blacklisted
< server: envoy
< 
* Connection #0 to host another-api left intact
upstream connect error or disconnect/reset before headers