const EventEmitter = require ('events');

class Logger extends EventEmitter {

    log(msg){
        console.log(msg);
        this.emit("logevent",{ id: 1, url: 'http'});
    }

}

module.exports = Logger;