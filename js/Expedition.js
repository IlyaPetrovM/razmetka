import Interview from './Interview.js';
import Publisher from './Publisher.js';
const Act = new exports.Act();
//import IDbTble from 
export default class Expedition extends Publisher {
    constructor(title,dbClient){
        super();
        if(title===undefined) throw TypeError('title is undefined');
        if(dbClient===undefined) throw TypeError('dbClient is undefined');
        var __title=title;       
        var __interviews = {};
        var __dbClient = dbClient;
        
        
        this.setTitle= function(t){ __title = t;this.update(this);}
        this.getTitle = function(){return __title;}

        this.interviewAdded = function(msg){
            let data = msg.data;
            __interviews[data.id] = new Interview(data.id, data.title, new Date(data._date), data.informants, data.reporters, data.exterier, __dbClient);
            this.update(this);
        }
        
        this.addInterview = function(title, date, informants, reporters, exterier){
            let data = {
                informants:informants,
                reporters:reporters,
                exterier:exterier,
                title:title,
                _date:date
            };
            let sql = {
                action: Act.CREATE,
                table: 'Interview',
                data:data
            }
            __dbClient.send(__title+'addInterview',sql);
        }
        __dbClient.addSubscriber(__title+'addInterview',this.interviewAdded.bind(this));

        this.interviewsLoaded = function(msg){
            console.log(msg);
            let iws = msg.data;
            for(let i in iws){
                let data = iws[i];
                __interviews[data.id] = new Interview(data.id, data.title, new Date(data._date), data.informants, data.reporters, data.exterier, __dbClient);
            }
            this.update(this);
        }

        this.loadInterviews = function(){
            let sql = {
                action:Act.LOAD,
                table:'Interview'
            };
            __dbClient.send(__title+'loadInterviews',sql);
        }
        __dbClient.addSubscriber(__title+'loadInterviews',this.interviewsLoaded.bind(this));

        
        this.getInterviews = function(){
            return __interviews;
        }
        
        this.setTitle(title);
        
    }
}
