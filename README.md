# Three Containers

**Run:**

- cd infrastructure
- ./startup.sh

**Check transparent proxy:**

- docker exec -it infrastructure_application_1 curl -v another-api:80/ping
- check header: "Server":
- check error: "upstream connect error or disconnect/reset before headers"
