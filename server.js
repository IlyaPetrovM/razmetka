//server.js
var act = new require('./act.js').Act;
const Act = new act();
console.log(Act.CREATE);
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
            host:'localhost',
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
        var id = parseInt(Math.random()*10000);
        this.clients[id] = wsocket;
        console.log('Соединение ' + id + ' открыто');
        wsocket.on('message',this.processMessage.bind(this,id));
        wsocket.on('close',this.processClose.bind(this,id));
    }
    
    processMessage(id,inMsg){
        console.log(id,inMsg,Act.CREATE);
        var msg = JSON.parse(inMsg);
        let sql;
        switch(msg.action){
            case Act.CREATE:
                if(msg.table === 'Interview'){
                    sql = `INSERT INTO ${msg.table} (title, _date) VALUES ('${msg.title}','${msg.date}');`;
                }
                this.sqlClient.query( sql, function(err, result){
                    if(err) throw err;
                    this.sqlClient.query( `SELECT LAST_INSERT_ID();`,function(error, selectRes){
                        if(error) throw error;
                        msg['id'] = selectRes[0]['LAST_INSERT_ID()']; 
                        let outMsg = JSON.stringify(msg);
                        for(let key in this.clients){
                            this.clients[key].send(outMsg);
                        }
                        console.log('msg: ' + outMsg);
                    }.bind(this) );
                    console.log('result: ' + JSON.stringify(result));
                }.bind(this) );
                break;
            case Act.LOAD:
                if(msg.id){
                    sql = `SELECT * FROM ${msg.table} WHERE id=${msg.id};`;
                }else{
                    sql = `SELECT * FROM ${msg.table};`;
                }
                this.sqlClient.query( sql, this.processSelect.bind(this,id,msg) );
                console.log('LOAD');
                break;
            default:
                console.log("Неизвестная команда: ",msg.action);
        }
    }
    processSelect(id, msg, err, selectRes){
        if(err) throw err;
        let outMsgJs = msg;
        outMsgJs['result'] = selectRes;
        let outMsg = JSON.stringify(outMsgJs);
        this.clients[id].send(outMsg);
        console.log(`${id} ${outMsg}`);
    }
    processClose(id){
        console.log('Соединение ' + id + ' закрыто');
        delete this.clients[id];
    }
}
var razmetServer = new Server(8081);