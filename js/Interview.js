/**************************************
    Interview
**************************************/
//import IDbTable from './IDbTable.js';
import Publisher from './Publisher.js';
import TrackMedia from './TrackMedia.js';
import TrackText from './TrackText.js';
export default class Interview extends Publisher{
    constructor(id,_title, _date, wsClient){
        super(wsClient);
        this.title = _title;
        var __id = id;
        this.id = id;
        this._date = _date;
        this.onidupdated = function(newid){};
        this.onupdate = function(){};
        this.ondelete = function(){};
        this.trackMediaCreated = function(){};
        this.trackTextCreated = function(){};
        this.getId = function(){
            return __id;
        }
        
        var __tracks = {};
        var __date = _date;
        var __title = _title;
        this.getTitle = function(){
            return __title;
        }
        this.tracks = {};
        this.meLoaded = function(me){
            __date = me._date;
            __title = me.title;
            this.update(this);
        }
        this.loadMe = function(id){
            
        }
        
        this.trackAdded = function(track){
            //TODO
            __tracks[track.getId()] = track;
            this.update(this);
        }
        this.addTrack = function(track){
            //TODO
            this.trackAdded(track);
        }
        
        this.trackRemoved = function(id){
            //TODO
            delete __tracks[id];
            this.update(this);
        }
        this.removeTrack = function(id){
            //TODO
            this.trackRemoved(id);
        }
        
        this.tracksLoaded = function(tracks){
            //TODO
            __tracks = tracks;
            this.update(this);
        }
        this.loadTracks = function(){
            //TODO
        }
        
        this.interviewEdited = function(iw){
            //TODO
            if(iw._date){
                __date = iw._date;
            }
            if(iw.title){
                __title = iw.title;
            }
            this.update(this);
        }
        this.editInterview = function(iw){
            //TODO
            this.interviewEdited(iw);
        }
        this.getDate = function(){
            return __date;
        }
        
    }
    get table(){
        return 'Interview';
    }
    get sender(){
        return 'Interview'+this.id;
    }
    

    create(){
        super.create({title:this.title, _date:this._date },this.table);
        console.log('Interview create');
    }
    
    
    update(_data){
        super.update(_data,this.table);
    }
    processUpdate(msg){
        for(let key in msg.data){
            this[key] = msg.data[key];
        }
        this.onupdate();
    }
    
    processDelete(msg){
        console.log('processDelete' + this.id);
        this.ondelete(this.id);
    }
    processError(){
        //TODO Interview Error
    }
    get data(){
        return {'title':0,
                'id':0,
                '_date':0};
    }
    
    show(parentNode){
        for(let k in this){
            console.log(k);
        }
//        this.viz = new VizInterview(parentNode,this);
        this.load();
    }
    
    hide(){
        this.viz.hide();
        delete this.viz;
    }
    
    
    get name(){
        return "Interview";
    }
    
    load(){
        console.log('load Interview');
        super.load('Track',`int_id = ${this.id}`);
        console.log('1....load Interview');
    }
    
    processLoad(msg){
        console.log('2....load Interview');
        if(msg.table === 'Track'){
            for(let i in msg.result){
                this.createTrackSwitch(msg.result[i]);
            }
        }
        console.log('done');
    }
    addTrackMedia(title){
        super.create(
            {
                title:title,
                _type:'Media',
                int_id:this.id
            },'Track');
    }
    addTrackText(title){
        super.create(
            {
                title:title,
                _type:'Text',
                int_id:this.id
            },'Track');
    }
    createTrackSwitch(data) {
         console.log('3....load Interview',data);
        switch(data._type){
            case 'Media':
                var track = new TrackMedia(data.title, data.id);
                this.tracks[data.id] = track;
                this.trackMediaCreated(track);
                console.log('4....load Interview');
                console.log(this.tracks);
                break;
            case 'Text':
                var track  = new TrackText(data.title, data.id);
                
                this.tracks[data.id] = track;
                this.trackTextCreated(track);
                break;
        }
    }


    processCreate(msg){
        if(msg.table === 'Track'){
            let data = msg.data;
            this.createTrackSwitch(data);
        }
    }
}  