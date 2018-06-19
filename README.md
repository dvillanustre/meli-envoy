Yoy need docker-compose [here](https://docs.docker.com/compose/install/).
You can reproduce both scenarios with folders three_containers/ and one_container/.

# Three Containers

**Run:**

- ```cd three_containers/```
- ```./startup.sh```

**Check transparent proxy:**

- ```docker exec -it three_containers_application_1 curl -v another-api:80/ping```
- check envoy header: "Server" : "envoy"
- check error: "upstream connect error or disconnect/reset before headers"



# One Container

**Run:**

- ```cd one_container/```
- ```./startup.sh```

**Check transparent proxy:**

- ```docker exec -it one_container_http-middleware_1 curl -v localhost:8080/ping```
- check envoy header: "Server": "envoy"
- check status code: HTTP/1.1 200 OK
