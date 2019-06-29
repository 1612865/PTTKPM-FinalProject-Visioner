|Student ID|Name
|----------|---|
|1612865|Lương Tấn Khang|
|1612891|Phan Quốc Thắng|

# Visioner Server Install

## Requirement
1. Nodejs >= 8.0
2. NPM >= 5.6 or Yarn >= 1.3
3. Docker and docker-compose

## Install
1. Clone project and cd
```
git clone https://github.com/1612865/Visioner.git
```
```
cd Visioner
```
2. Install dependencies
```
yarn install
```
or
```
npm install
```
3. Run services from docker

Docker include 3 services: RabbitMQ, Redis, and Postgres

Open new terminal with the same directory and run

```
docker-compose up
```

4. Run Visioner server and sender

Run server
```
node index.js
```
Run sender
```
node sender.js
```

5. Access website
```
http://localhost:9990
```
