/* IDbTable */
const Act = new exports.Act();
export default class IDbTable {
    constructor(wsClient){
        var __wsClient = wsClient;
        var __callbacks = {};
        this.removeSubscriber = function(callback_id){
            __callbacks[callback_id] = undefined;
            delete __callbacks[callback_id];
        }
        this.addSubscriber = function(callback_id,callback){
            if(callback_id===undefined) throw TypeError('callback Id is undefined');
            else if(callback===undefined) throw TypeError('callback function is undefined');
            else if(__callbacks[callback_id]!==undefined) throw Error('Unable to rewrite existed callback:'+callback_id);
            __callbacks[callback_id] = callback;
        }
        var onmessage = function(messageEvent){
            let msg = JSON.parse(messageEvent.data);
            __callbacks[msg.callback_id](msg.data);
        }
        __wsClient.addEventListener('message',onmessage.bind(this));
        __wsClient.onconnection = function(){
            console.log('connected');
        }
        
        
        var __waitForConnection = function (callback, interval) {
            if (__wsClient.readyState === 1) {
                callback();
            } else {
                var that = this;
                // optional: implement backoff for interval here
                setTimeout(function () {
                    __waitForConnection(callback, interval);
                }, interval);
            }
        };
        var __send = function (message, callback) {
            __waitForConnection(function () {
                __wsClient.send(message);
                if (typeof callback !== 'undefined') {
                  callback();
                }
            }, 500);
        };

        
        this.send = function(callback_id,data) {
            if(data===undefined) throw TypeError('data field is undefined');
            if(__callbacks[callback_id]===undefined) throw RangeError('unable to send message to callback with unexisted id');
            let outMsg = {
                callback_id:callback_id,
                data:data
            };
            __send(JSON.stringify(outMsg));
        }
//        this.query = function(callback_id, action, ){

//        }
    }
    get table(){
        throw Error('неизвесная реализация');
        return undefined;
    }
    get sender(){
        throw Error('неизвесная реализация');
        return undefined;
    }
    load(table,where){
        let outMsg = JSON.stringify({
            action: Act.LOAD,
            table: table,
            sender: this.sender,
            where: where
        });
        this.wsClient.send(outMsg);
    }
    
    create(data,table,callback){
        if(callback){
            this.processCreate = callback;
        }
       let outMsg = JSON.stringify({
                action: Act.CREATE,
                sender:this.sender,
                'table':table,
                'data':data
        }); 
        this.wsClient.send(outMsg);
    }
    
    update(data,table){
        let msg_obj = {
            action: Act.UPDATE,
            table: table,
            sender: this.sender,
            'id':this.id,
            'data':data
        };
        let outMsg = JSON.stringify(msg_obj);
        this.wsClient.send(outMsg);
        console.log(outMsg);
    }
    remove(id,table){
        let outMsg = JSON.stringify({
                action:Act.DELETE,
                'id':id,
               'table':table,
               sender:this.sender
           });     
           this.wsClient.send(outMsg);
    }
    processMessageFromServer(inMsg){

    }
    processLoad(msg){
        console.log('LOAD');
        throw Error('abstract method used');
    }
    processUpdate(msg){
        console.log('UPDATE');
        throw Error('неизвесная реализация');
    }
    processDelete(msg){
        console.log('DELETE');
        throw Error('неизвесная реализация');
    }
    processCreate(msg){
        console.log('CREATE');
        throw Error('неизвесная реализация');
    }
    processError(msg){
        console.log('ERROR');
        throw Error('неизвесная реализация');
    }
}
