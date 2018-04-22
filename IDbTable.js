/* IDbTable */
const Act = new exports.Act();
export default class IDbTable {
    constructor(wsClient){
        this.wsClient = wsClient;
        this.wsClient.addEventListener('message',this.processMessageFromServer.bind(this));
    }
    get table(){
        throw Error('неизвесная реализация');
        return undefined;
    }
    get sender(){
        throw Error('неизвесная реализация');
        return undefined;
    }
    load(table){
        let outMsg = JSON.stringify({
            action: Act.LOAD,
            table: table,
            sender: this.sender
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
       let msg = JSON.parse(inMsg.data);
        if(msg.sender === this.sender){
        console.log(msg);
            switch(msg.action){
                case Act.LOAD:
                    this.processLoad(msg);
                    break;
                case Act.CREATE:
                   this.processCreate(msg);
                    break;
                case Act.UPDATE:
                    this.processUpdate(msg);
                    break;
                case Act.DELETE:
                    this.processDelete(msg);
                    break;
                case Act.ERROR:
                    this.processError(msg);
                    break;
                default:
                    console.log('Неизвестная команда:',msg.action);   
        } 
        }
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