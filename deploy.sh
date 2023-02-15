docker-compose build
yes | docker system prune
docker-compose up --no-deps -d --build
docker-compose restart backend