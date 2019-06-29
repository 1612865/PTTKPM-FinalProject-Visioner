|Student ID|Name
|----------|---|
|1612865|Lương Tấn Khang|
|1612891|Phan Quốc Thắng|

# Visioner Client Install

## Requirement
1. .Net >= 4.0
2. Visual studio 2019
3. Visioner server, docker and AI core have run (for local running)

## Clone project
```
git clone https://github.com/1612865/Visioner_Client.git
```
## Install

Install EmguCV from nuget (Visual studio will automatically recommend)

## Build
Switch to release and build

## Run
1. Create folder 'plugins' in Release folder
2. Copy all file in Release folder of porject 'HTTP' and 'RTSP' to Release folder of Visioner_Client
3. For local running: Create 'server.txt' with content
```
http://localhost:9990/api/upload/
```



