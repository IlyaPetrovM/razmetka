/* IDbTable */
const Act = new exports.Act();
export default class IDbTable {
    constructor(wsClient){
//        var __wsClient = wsClient;
//        this.processMessageFromServer = function(inMsg){
//            let msg = JSON.parse(inMsg.data);
//            if(msg.sender === this.sender){
//                switch(msg.action){
//                    case Act.LOAD:
//                        this.processLoad(msg);
//                        break;
//                    case Act.CREATE:
//                       this.processCreate(msg);
//                        break;
//                    case Act.UPDATE:
//                        this.processUpdate(msg);
//                        break;
//                    case Act.DELETE:
//                        this.processDelete(msg);
//                        break;
//                    case Act.ERROR:
//                        this.processError(msg);
//                        break;
//                    default:
//                        console.log('Неизвестная команда:',msg.action);
//                }
//            }
//        }
//        __wsClient.addEventListener('message',this.processMessageFromServer.bind(this));

        var __callbacks = {};
        this.addSubscriber = function(callback_id,callback){
            if(callback_id===undefined) throw TypeError('callback Id is undefined');
            else if(callback===undefined) throw TypeError('callback function is undefined');
            else if(__callbacks[callback_id]!==undefined) throw Error('Unable to rewrite existed callback:'+callback_id);
            __callbacks[callback_id] = callback;
        }
        var onmessage = function(inMsg){
            let msg = JSON.parse(inMsg);
            __callbacks[msg.callback_id](msg.data);
        }
        this.send = function(callback_id,data) {
            if(data===undefined) throw TypeError('data field is undefined');
            if(__callbacks[callback_id]===undefined) throw RangeError('unable to send message to callback with unexisted id');
            let outMsg = {
                callback_id:callback_id,
                data:data
            };
            onmessage(JSON.stringify(outMsg));
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
