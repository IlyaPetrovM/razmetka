export default class Publisher {
    constructor(){
        var subscribers = [];
        this.addSubscriber = function(sub){
            subscribers.push(sub);
        }
        this.update = function(data){
            subscribers.forEach(function(sub){
                sub.onUpdate(data);
            });
        }
        this.remove = function(){
            console.log('remove');
            subscribers.forEach(function(sub){
                sub.onPublisherRemove();
            });
        }
        this.removeSubscriber = function(callback){
            let idx = subscribers.findIndex(callback);
            subscribers.splice(idx);
            console.log(subscribers);
        }
    }
}