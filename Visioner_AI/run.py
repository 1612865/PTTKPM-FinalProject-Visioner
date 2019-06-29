import pika
import redis
import cv2
import configparser
import uuid
import json
import numpy as np
import json
from app.detection import Detector


def get_config(file_path):
    config = configparser.ConfigParser()
    config.read(file_path)
    config = config['DEFAULT']
    return config['REDIS_HOST'], config['REDIS_PORT'], config['REDIS_DB'],  \
        config['RABBITMQ_HOST'], config['RABBITMQ_PORT'], \
        config['RABBITMQ_USER'], config['RABBITMQ_PASS'], config['RABBITMQ_URL'], \
        config['RABBITMQ_EXCHANGE'], config['RABBITMQ_QUEUE'], config['REDIS_PREFIX']


def connect_redis(host, port, db):
    return redis.Redis(host=host, port=port, db=db)


def connect_rabbitmq(host, port, url, user, password):
    credentials = pika.PlainCredentials(user, password)
    parameters = pika.ConnectionParameters(host, port, url, credentials)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    return connection, channel


def init_exchange(connection, channel, exchange):
    channel.exchange_declare(exchange=exchange, exchange_type='direct')


def callback(ch, method, properties, body):
    global r, detector, channel
    message = json.loads(body.decode("utf-8"))
    frame_id = message['frame_id']
    output_source = message['output_source']
    output_type = message['output_type']
    print('output source', output_source)
    print('output type', output_type)
    result = r.get(frame_id)
    try:
        decoded = cv2.imdecode(np.frombuffer(result, np.uint8), 1)
        #print(detector.detect(decoded))
        count = detector.detect(decoded)
        message = json.dumps({
            "output_source": output_source,
            "output_type": output_type,
            "count": count
        })
        channel.basic_publish(exchange=RABBITMQ_EXCHANGE, routing_key=RABBITMQ_QUEUE + "_SENDER", body=message)
    except:
        print('error')

    r.delete(frame_id)


if __name__ == '__main__':
    detector = Detector()
    REDIS_HOST, REDIS_PORT, REDIS_DB, RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASS, \
    RABBITMQ_URL, RABBITMQ_EXCHANGE, RABBITMQ_QUEUE, REDIS_PREFIX = get_config('config.ini')
    r = connect_redis(REDIS_HOST, REDIS_PORT, REDIS_DB)
    connection, channel = connect_rabbitmq(RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_URL, RABBITMQ_USER, RABBITMQ_PASS)
    init_exchange(connection, channel, RABBITMQ_EXCHANGE)
    result = channel.queue_declare('', exclusive=True)
    queue_name = result.method.queue
    channel.queue_bind(exchange=RABBITMQ_EXCHANGE, queue=queue_name, routing_key=RABBITMQ_QUEUE)
    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
    channel.start_consuming()

