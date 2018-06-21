//server.js
var act = new require('./js/act.js').Act;
const Act = new act();

var uploader = new require('./uploader.js');

class Server{
    constructor(_port){
        var WebSocketServer = new require('ws');
        this.wsServer = new WebSocketServer.Server({
            port:_port
        });
        this.wsServer.on('connection',this.prosessConnection.bind(this));
        this.clients = {};
        console.log('Server running on port '+_port);
        
        this.mysql = require('mysql');
        this.sqlClient = this.mysql.createConnection({
            host:'127.0.0.1',
            port:3333,
            user:'admin',
            password:'IL15OHM.m',
            database:'razmetka'
        });
        this.sqlClient.connect(this.processDbConnection.bind(this));
    }
    processDbConnection(err){
        if(err)throw err;
        console.log('database connected');
    }
    prosessConnection(wsocket){
        var id = parseInt((new Date()).getTime());
        this.clients[id] = wsocket;
        console.log('Соединение ' + id + ' открыто');
        wsocket.on('message',this.processMessage.bind(this,id));
        wsocket.on('close',this.processClose.bind(this,id));
    }

    sendToAllClients(outMsg){
        for(let key in this.clients){
                this.clients[key].send(outMsg);
        }
    }
    sendError(err, client_id){
        console.log(err);
    }

    processMessage(client_id, inMsg){
        console.log('CLIENT:', client_id,'\n>>', inMsg);
        var onResult = function(err, result){
            if(err) throw err;
            let outMsgJson = JSON.parse(inMsg);
            if(result.insertId) outMsgJson.data.data['id'] = result.insertId;
            console.log(outMsgJson);
            let outMsgStr = JSON.stringify(outMsgJson);
            this.sendToAllClients(outMsgStr);
        }
        var processSelect = function(err, selectRes){
            if(err) throw err;
            let outMsgJson = JSON.parse(inMsg);
            outMsgJson.data['data'] = selectRes;
            let outMsg = JSON.stringify(outMsgJson);
            this.clients[client_id].send(outMsg);
            console.log(outMsgJson);
        }
        var msg = JSON.parse(inMsg).data;
        try{
        switch(msg.action){
            case Act.LOAD:
                this.select(msg, client_id, processSelect.bind(this));
                console.log('> SELECT <');
                break;
            case Act.CREATE:
                this.insert(msg, onResult.bind(this));
                console.log('> INSERT <');
                break;
            case Act.UPDATE:
                this.update(msg, onResult.bind(this));
                console.log('> UPDATE <');
                break;
            case Act.DELETE:
                this.remove(msg, onResult.bind(this));
                console.log('> DELETE <');
                break;
            default:
                this.sendError("Неизвестная команда: "+msg.action, client_id);
        }
        }catch(err){
            this.sendError(err, client_id);
        }
    }
    update(msg, callback){
        let equations = [];
        for(let key in msg.data){
            if(key === '_date'){
                let d = new Date(msg.data[key]).toISOString().slice(0,19).replace('T',' ');
                equations.push(`${key}='${d}'`);  
            }else{
                equations.push(`${key}='${msg.data[key]}'`);    
            }
        }
        let sql = `UPDATE ${msg.table} SET ${equations.join(',')} WHERE id=${msg.id};`;
        this.sqlClient.query(sql, callback);
    }
    remove(msg,callback){
        let sql;
        sql = `DELETE FROM ${msg.table} WHERE id=${msg.id};`;
        var outMsg = JSON.stringify(msg);
        this.sqlClient.query(sql, callback);
    }
    
    insert(msg,callback) {
        let sql;
        let valuesList='', keysList='';
        for(let key in msg.data){
            if(key === '_date'){
                let d = new Date(msg.data._date).toISOString().slice(0,19).replace('T',' ');
                valuesList += `'${d}',`;
            }else{
                valuesList += `'${msg.data[key]}',`;
            }
            keysList += `${key},`;
        }
        keysList = keysList.slice(0,keysList.length-1);
        valuesList = valuesList.slice(0,valuesList.length-1);
        sql = `INSERT INTO ${msg.table} (${keysList}) VALUES (${valuesList});`;
        console.log('\n'+sql+'\n');

        this.sqlClient.query(sql, callback);
        return {msg};
    }
    
    select(msg, id, callback) {
        let sql;
        if(msg.where){
            sql = `SELECT * FROM ${msg.table} WHERE ${msg.where}`;
        }else{
            sql = `SELECT * FROM ${msg.table};`;
        }
        console.log(sql);
        this.sqlClient.query(sql, callback);
    }
    

    processClose(id){
        console.log('Соединение ' + id + ' закрыто');
        delete this.clients[id];
    }
}
var razmetServer = new Server(8081);
