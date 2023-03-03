yes | docker system prune
docker-compose up --no-deps -d --build backend
docker-compose restart backend
sleep 5
docker-compose up --no-deps -d --build client
docker-compose restart client