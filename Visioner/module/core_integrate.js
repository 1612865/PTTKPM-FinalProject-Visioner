const redis = require("redis");
const amqp = require('amqplib/callback_api');

class Core_Integrate {
    constructor(config){
        this.config = config;
        this.init_redis();
        this.init_rabbitmq();
        this.publishChannel = null
        this.rb_routing_key = this.config['rabbitmq-routing-key'];
        this.rb_exchange = this.config['rabbitmq-exchange'];
    }
    init_redis(){
        let redis_host = this.config['redis-host'];
        let redis_port = this.config['redis-port'];
        let redis_db = this.config['redis-db'];
        this.redis_prefix = this.config['redis-prefix'];
        this.redis_store = redis.createClient(
            {
                'host': redis_host,
                'port': redis_port,
                'db': redis_db,
                'return_buffers': true
            }
            );
    }

    init_rabbitmq(){
        let controller = this
        let rb_host = this.config['rabbitmq-host'];
        let rb_port = this.config['rabbitmq-port'];
        let rb_user = this.config['rabbitmq-user'];
        let rb_pass = this.config['rabbitmq-pass'];
        let rb_url = this.config['rabbitmq-url'];
        let rb_exchange = this.config['rabbitmq-exchange'];
        let rb_routing_key = this.config['rabbitmq-routing-key'];

        const opt = { credentials: amqp.credentials.plain(rb_user, rb_pass)}
        this.rb_connection =  amqp.connect('amqp://' + rb_host + ':' + rb_port + rb_url, opt, function(err, conn) {
            conn.createChannel(function(err, ch) {
                ch.assertExchange(rb_exchange, 'direct', {durable: false});
                controller.publishChannel = ch
            });
        }, {noAck: false});
    }

    async publishMessage(content) {
        if (this.publishChannel && this.rb_exchange && this.rb_routing_key){
            await this.publishChannel.publish(this.rb_exchange, this.rb_routing_key, Buffer.from(content))
        }
    }

    async sendBuffer(frame_id, output_source, output_type, buffer){
        await this.redis_store.set(frame_id, buffer)
        await this.publishMessage(JSON.stringify({
            frame_id,
            output_source,
            output_type
        }))
    }
}

module.exports = Core_Integrate;
