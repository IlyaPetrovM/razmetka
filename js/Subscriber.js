export default class Subscriber{
    constructor(){
    
    this.onUpdate = function(data){
        console.log(data);
    }
    this.onPublisherRemove = function(){
        console.log('remove signal');
    }
//    this.onError = function(){
//        
//    }
   }
}