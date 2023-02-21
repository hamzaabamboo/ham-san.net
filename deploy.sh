yes | docker system prune
docker-compose up --no-deps -d --build backend
docker-compose restart backend
docker-compose up --no-deps -d --build client
docker-compose restart client