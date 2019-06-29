const jwt = require('jsonwebtoken');

class JWT {
    constructor(key){
        this.key = key;
    }

    generate_token(data, min_exp){
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + min_exp,
            data: data
        }, this.key);
    }

    verify_token(token){
        try {
            let decoded = jwt.verify(token, this.key);
            return decoded;
          } catch(err) {
            return false;
          }
    }
}

module.exports =  JWT;
