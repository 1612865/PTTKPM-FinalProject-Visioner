const amqp = require('amqplib/callback_api');
const config = require('./config/conf');
const request = require('request')

let rb_host = config['rabbitmq-host'];
let rb_port = config['rabbitmq-port'];
let rb_user = config['rabbitmq-user'];
let rb_pass = config['rabbitmq-pass'];
let rb_url = config['rabbitmq-url'];
let rb_exchange = config['rabbitmq-exchange'];
let rb_routing_key = config['rabbitmq-routing-key'] + "_SENDER";

const opt = { credentials: amqp.credentials.plain(rb_user, rb_pass)}
this.rb_connection =  amqp.connect('amqp://' + rb_host + ':' + rb_port + rb_url, opt, function(err, conn) {
    conn.createChannel(function(err, ch) {
        ch.assertExchange(rb_exchange, 'direct', {durable: false});
        ch.assertQueue('', {exclusive: true}, function(err, q) {
            console.log(' Rabbitmq client started ... ');
            ch.bindQueue(q.queue, rb_exchange, rb_routing_key);

            ch.consume(q.queue, function(msg) {
            let content = JSON.parse(msg.content.toString());
            let count = content["count"]
            let output_source = content["output_source"]
            let output_type = content["output_type"]
            ch.ack(msg);
            let data = ""
            if (output_type == 'json')
                data = JSON.stringify({count})
            else data=`<count>${count}</count>`
            let option = {
                url: output_source,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/' + output_type,
                    'Content-Length': data.length
                },
                body: data
            }
            request(option, (error, response, body) => {
                console.log("Recv", body)
            })
            });
        });


    });
}, {noAck: false});
