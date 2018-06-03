import Interview from './Interview.js';
import Publisher from './Publisher.js';
export default class Expedition extends Publisher {
    constructor(title,dbClient){
        super();
        if(title===undefined) throw TypeError('title is undefined');
//        if(dbClient===undefined) throw TypeError('dbClient is undefined');
        var __title;       
        var __interviews = {};
        var __dbClient = dbClient;
        
        this.setTitle= function(t){ __title = t;this.update(this);}
        this.getTitle = function(){return __title;}

        this.interviewAdded = function(data){
            __interviews[data.id] = new Interview(data.id, data.title, data._date);
            this.update(this);
        }
        
        this.addInterview = function(title,date){
            let tmp = {
                title:title,
                _date:date
            };
            tmp['id'] = (new Date().getTime()); // TODO remove it
            this.interviewAdded(tmp); //TODO addInterview replace by ws.send
        }
        
        this.interviewRemoved = function(id){
            delete __interviews[id];
        }
        
        this.removeInterview = function(id){
            //TODO removeInterview
            this.interviewRemoved(id);
        }

        this.interviewsLoaded = function(iws){
            for(let i in iws){
                let data = iws[i];
                __interviews[data.id] = new Interview(data.id, data.title, data._date);
            }
            this.update(this);
        }

        this.loadInterviews = function(){
            // TODO loadInterviews
            var iws = [{id:15,
                        title: 'интервью '+15,
                        _date: '2018-05-12'},
                        {id:2,
                        title:'Интервью '+2,
                        _date:'2016-05-12'}];
            this.interviewsLoaded(iws);
        }
        
        this.getInterviews = function(){
            return __interviews;
        }
        
        this.setTitle(title);
        
        this.loadInterviews();
    }
}
