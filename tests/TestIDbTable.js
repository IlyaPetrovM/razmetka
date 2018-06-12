import Test from './Test.js';
import IDbTable from '../js/IDbTable.js';
export default class TestIDbTable extends Test {
    constructor(){
        super();
        this.testSend_asdf_send_asdf = function(){
            let t = new IDbTable();
            let data = {a:1,b:2};
            let res = undefined;
            let foo = function(msg){
                console.info(msg);
                res = msg;
            }
            t.addSubscriber('foo45',foo);
            try{
                t.send('foo45',data);
            }catch(err){
                console.warn(err);
            }finally{
                return JSON.stringify(res) === JSON.stringify(data);
            }
        }
        this.testSend_data_undef_throws_Error = function(){
            let t = new IDbTable();
            let data = undefined;
            let res = 2;
            var foo = function(msg){
                console.info(msg);
                res = 1;
            }
                t.addSubscriber('foo45',foo);
            try{
                t.send('foo45',data); /// Предполагается что foo будет вызвана до того как будет ретерн.
            }catch(err){
                return err.name === 'TypeError' && err.message === 'data field is undefined';
            }
            return false;
        }
        this.testSend_with_unexisted_id_throws_Error = function(){
            let t = new IDbTable();
            let data = {d:123};
            let res = 2;
            let foo = function(msg){
                console.info(msg);
                res = 1;
            }
            t.addSubscriber('foo45',foo);
            try{
                t.send('unexisted_id',data);
            }catch(err){
                return err.name === 'RangeError' && err.message === 'unable to send message to callback with unexisted id';
            }
            return false;
        }
        this.testAddSubscriber_callbackUndef_throwsError = function(){
            let t = new IDbTable();
            let foo = function(){
                console.log('testFoo');  
            };
            try{
                t.addSubscriber(undefined,foo);
            }catch(err){
                return err.name === 'TypeError' && err.message === 'callback Id is undefined';
            }
            return false;
        }
        this.testAddSubscriber_callback_Func_Undef_throwsError = function(){
            let t = new IDbTable();
            try{
                t.addSubscriber('callback Id');
            }catch(err){
                return err.name === 'TypeError' && err.message === 'callback function is undefined';
            }
            return false;
        }
        this.testAddSubscriber_add_existed_subscriber_throws_Error = function(){
            let t = new IDbTable();
            let foo = function(){
                console.log('testFoo');  
            };
            t.addSubscriber('id',foo);
            try{
                t.addSubscriber('id',foo);
            }catch(err){
                return err.name === 'Error' && err.message === 'Unable to rewrite existed callback';
            }
            return false;
        }
    }
}
 new TestIDbTable().run();