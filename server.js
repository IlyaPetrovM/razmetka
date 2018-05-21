//server.js
var act = new require('./js/act.js').Act;
const Act = new act();

var sys = require ('util'),
url = require('url'),
http = require('http'),
qs = require('querystring');
//var static = require('node-static');
//var file = new static.Server('.');
var fs = require('fs');
//
//http.createServer(function (req, res) {
//    if(req.method=='POST') {
//            var body='';
//            req.on('data', function (data) {
//                body +=data;
//            });
//            req.on('end',function(){
//                var POST =  qs.parse(body);
//                console.log(GET);
//            });
//    }
//    else if(req.method=='GET') {
//        var url_parts = url.parse(req.url,true);
//        console.log(url_parts.query);
//        fs.readFile('interview.html',function(err,data){
//            res.write(data+`Hello client! query: ${url_parts.query['id']}`);
//            res.end();
//        });
//    }
////    file.serve(req, res);
//}).listen(8080);
//console.log('Server running on port 8080');

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
        var id = parseInt(Math.random()*10000);
        this.clients[id] = wsocket;
        console.log('Соединение ' + id + ' открыто');
        wsocket.on('message',this.processMessage.bind(this,id));
        wsocket.on('close',this.processClose.bind(this,id));
    }

    processMessage(id,inMsg){
        console.log('\n',id,inMsg);
        var msg = JSON.parse(inMsg);
        
        
        switch(msg.action){
            case Act.CREATE:
                var ret = this.insert(msg);
                msg = ret.msg;
                break;
            case Act.LOAD:
                this.select(msg, id);
                console.log('LOAD');
                break;
            case Act.UPDATE:
                this.update(msg);
                console.log('UPDATE');
                break;
            case Act.DELETE:
                this.remove(msg);
                console.log('DELETE');
                break;
            default:
                console.log("Неизвестная команда: ",msg.action);
        }
    }
    update(msg){
        let equations = [];
        for(let key in msg.data){
            if(key==='_date'){
                let d = new Date(msg.data[key]).toISOString().slice(0,19).replace('T',' ');
                equations.push(`${key}='${d}'`);  
            }else{
                equations.push(`${key}='${msg.data[key]}'`);    
            }
        }
        let sql = `UPDATE ${msg.table} SET ${equations.join(',')} WHERE id=${msg.id};`;
        this.sqlClient.query(sql, function(err, updateRes){
            if(err) throw err;
            let outMsg = JSON.stringify(msg);
            for(let key in this.clients){
                this.clients[key].send(outMsg);
            }
            console.log(updateRes);
        }.bind(this));
    }
    remove(msg){
        let sql;
        sql = `DELETE FROM ${msg.table} WHERE id=${msg.id};`;
        var outMsg = JSON.stringify(msg);
        this.sqlClient.query(sql, function(err,deleteRes){
            if(err) throw err;
            for(let key in this.clients){
                this.clients[key].send(outMsg);
            }
            console.log(deleteRes);
        }.bind(this));
    }
    
    insert(msg) {
        let sql;
        if(msg.table === 'Interview'){
            let d = new Date(msg.data._date).toISOString().slice(0,19).replace('T',' ');
            sql = `INSERT INTO ${msg.table} (title, _date) VALUES ('${msg.data.title}', '${d}');`;
        }else{
            let valuesList='', keysList='';
            for(let key in msg.data){
                keysList += `${key},`;
                valuesList += `'${msg.data[key]}',`;
                console.log('\n'+ key + ':' + msg.data[key]+'\n');
            }
            keysList = keysList.slice(0,keysList.length-1);
            valuesList = valuesList.slice(0,valuesList.length-1);
            sql = `INSERT INTO ${msg.table} (${keysList}) VALUES (${valuesList});`;
            console.log('\n'+sql+'\n');
        }
        this.sqlClient.query( sql, function(err, result){
            if(err) throw err;
            msg.data['id'] = result.insertId; 
            let outMsg = JSON.stringify(msg);
            for(let key in this.clients){
                this.clients[key].send(outMsg);
            }
            console.log('msg: ' + outMsg);
        }.bind(this) );
        return {msg};
    }
    
    select(msg, id) {
        let sql;
        if(msg.where){
            sql = `SELECT * FROM ${msg.table} WHERE ${msg.where}`;
        }else{
            sql = `SELECT * FROM ${msg.table};`;
        }
        console.log(sql);
        this.sqlClient.query( sql, this.processSelect.bind(this,id,msg) );
    }
    
    processSelect(id, msg, err, selectRes){
        if(err) throw err;
        let outMsgJs = msg;
        outMsgJs['result'] = selectRes;
        let outMsg = JSON.stringify(outMsgJs);
        this.clients[id].send(outMsg);
//        console.log(`${id}:\n ${selectRes[0]._date.toISOString()}`);
        console.log(`${id}:\n ${outMsg}`);
    }
    processClose(id){
        console.log('Соединение ' + id + ' закрыто');
        delete this.clients[id];
    }
}
var razmetServer = new Server(8081);