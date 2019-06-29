|Student ID|Name
|----------|---|
|1612865|Lương Tấn Khang|
|1612891|Phan Quốc Thắng|

# AI Core Install (For local running)

## Requirement
1. python3
2. pip3

## Clone project
```
git clone https://github.com/1612865/Visioner_AI.git
```
```
cd Visioner_AI
```
## Install library
For no gpu:
```
pip3 install -r requirements.txt
```
For gpu:

Change content of requirements.txt to
```
pika
redis
opencv-python
numpy
tensorflow-gpu
```
```
pip3 install -r requirements.txt
```

## Run
```
python3 run.py
```
