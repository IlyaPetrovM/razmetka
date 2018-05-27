/**************************************
    Interview
**************************************/
//import IDbTable from './IDbTable.js';
import Publisher from './Publisher.js';
import TrackMedia from './TrackMedia.js';
import TrackText from './TrackText.js';
export default class Interview extends Publisher{
    constructor(id,_title, _date, wsClient){
        super();
        var __id = id;
        var __date = _date;
        var __title = _title;
        var __tracks = {};
        var __wsClient = wsClient;

//        this.onidupdated = function(newid){};
//        this.onupdate = function(){};
//        this.ondelete = function(){};
//        this.trackMediaCreated = function(){};
//        this.trackTextCreated = function(){};
//        this.tracks = {};
        
        this.getId = function(){return __id;}
        this.getDate = function(){return __date;}
        this.getTitle = function(){return __title;}
        this.getTracks = function(){return __tracks;}
        
        this.meLoaded = function(me){
            __id = me.id;
            __date = me._date;
            __title = me.title;
            this.update(this);
        }
        
        this.loadMe = function(id_){
            if(!id_){ 
                console.error('id is',id_);
                return;
            }
            let tmp = {id:id_,
                          date:'2018-05-27',
                          title:'Петров И.М.'}; //TODO removeit
            this.meLoaded(tmp); //TODO ws.send
        }
        
        function addTrackByType(track) {
            switch(track._type){
                case 'Media':
                    __tracks[track.id] = new TrackMedia(track.title,track.id,__wsClient);
                    break;
                case 'Text':
                    __tracks[track.id] = new TrackText(track.title,track.id, __wsClient);
                    break;
                default:
                    console.error("Неизвестный тип трека:",track._type);
            }
        }

        this.trackAdded = function(track){
            addTrackByType(track);
            this.update(this);
        }
        this.addTrackMedia = function(_title){
            let trackM = {
                title: _title,
                _type:'Media'
            };
            trackM['id'] = parseInt(Math.random()*100); // TODO removeIt
            this.trackAdded(trackM); //TODO replace by ws.send
        }
        this.addTrackText = function(_title){
            let trackT = {
                title: _title,
                _type:'Text'
            };
            trackT['id'] = parseInt(Math.random()*100); // TODO removeIt
            this.trackAdded(trackT); //TODO replace by ws.send
        }
        
        this.trackRemoved = function(id){
            delete __tracks[id];            
            this.update(this);
        }
        this.removeTrack = function(id){
            //TODO
            this.trackRemoved(id);
        }
        
        this.tracksLoaded = function(tracks){
            for(let t in tracks){
                addTrackByType(tracks[t]);
            }
            this.update(this);
        }
        
        this.loadTracks = function(){
            let tmpTracks = [
                {id:parseInt(Math.random()*100), title:'AudioTrack',_type:'Media'},
                {id:parseInt(Math.random()*100), title:'Text Track',_type:'Text'},
                {id:parseInt(Math.random()*100), title:'Text 2 Track',_type:'Text'}
            ]; //TODO remove it
            this.tracksLoaded(tmpTracks); //TODO replace by ws.send
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

        this.loadTracks();
        
    }
    get table(){
        return 'Interview';
    }
    get sender(){
        return 'Interview'+this.id;
    }
    
//
//    create(){
//        super.create({title:this.title, _date:this._date },this.table);
//        console.log('Interview create');
//    }
    
    
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