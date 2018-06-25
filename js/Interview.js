/**************************************
    Interview
**************************************/
//import IDbTable from './IDbTable.js';
import Publisher from './Publisher.js';
import TrackMedia from './TrackMedia.js';
import TrackText from './TrackText.js';
const Act = new exports.Act();
export default class Interview extends Publisher{
    constructor(id,_title, _date, informants, reporters, exterier, wsClient){
        super();
        var __id = id;
        var __date = _date;
        var __title = _title;
        var __tracks = {};
        var __dbClient = wsClient;
        var __informants = informants, __reporters = reporters, __exterier = exterier;

        this.getInformants = function(){
            return __informants;
        }
        this.getReporters = function(){
            return __reporters;
        }
        this.getExterier = function(){
            return __exterier;
        }


        this.informantsSet = function(msg){
            //TODO informantsSet
            __informants = msg.data.informants;
            this.update(this);
        }
        this.setInformants = function(inf){
            //TODO setInformants
            let sql = {
                action: Act.UPDATE,
                table: 'Interview',
                id: __id,
                data: {informants: inf}
            };
            __dbClient.send(__id+'setInformants', sql);
        };
        __dbClient.addSubscriber(__id + 'setInformants', this.informantsSet.bind(this));

        this.reportersSet = function(msg){
            __reporters = msg.data.reporters;
            this.update(this);
        }
        this.setReporters = function(rep){
            let sql = {
                action: Act.UPDATE,
                table: 'Interview',
                id: __id,
                data: {reporters: rep}
            };
            __dbClient.send(__id+'setReporters', sql);
        }
        __dbClient.addSubscriber(__id + 'setReporters', this.reportersSet.bind(this));

        this.exterierSet = function(msg){
            //TODO exterierSet
            __exterier = msg.data.exterier;
            this.update(this);
        }
        this.setExterier = function(ext){
            let sql = {
                action: Act.UPDATE,
                table: 'Interview',
                id: __id,
                data: {exterier: ext}
            };
            __dbClient.send(__id+'setExterier', sql);
        }
        __dbClient.addSubscriber(__id+'setExterier', this.exterierSet.bind(this));

        
        this.getId = function(){return __id;}
        this.getDate = function(){return __date;}
        this.getTitle = function(){return __title;}
        this.getTracks = function(){return __tracks;}
        
        this.meLoaded = function(msg){
            let me = msg.data[0];
            __date = me._date;
            __title = me.title;
            __reporters = me.reporters;
            __informants = me.informants;
            __exterier = me.exterier;
            this.update(this);
        }
        
        this.loadMe = function(id_){
            if(!id_){ 
                console.error('id is',id_);
                return;
            }
            let sql = {
                action:Act.LOAD,
                table:'Interview',
                where:'id='+__id
            };
            __dbClient.send(__id+'loadMe',sql);
        }
        __dbClient.addSubscriber(__id+'loadMe',this.meLoaded.bind(this));
      
        var __this = this;
        function addTrackByType(track) {
            switch(track._type){
                case 'Media':
                    __tracks[track.id] = new TrackMedia(track.title,track.id, __this, __dbClient);
                    break;
                case 'Text':
                    __tracks[track.id] = new TrackText(track.title,track.id, __this, __dbClient);
                    break;
                default:
                    console.error("Неизвестный тип трека:",track._type);
            }
        }

        this.trackAdded = function(msg){
            console.log(msg.data);
            addTrackByType(msg.data);
            this.update(this);
        }
        this.addTrackMedia = function(_title){
            let trackM = {
                title: _title,
                _type:'Media',
                int_id:__id
            };
            let sql = {
                action: Act.CREATE,
                data:trackM,
                table:'Track'
            }
            __dbClient.send(__id+'addTM',sql);
        }
        __dbClient.addSubscriber(__id+'addTM',this.trackAdded.bind(this));
        
        this.addTrackText = function(_title){
            let trackT = {
                title: _title,
                _type:'Text',
                int_id:__id
            };
            let sql = {
                action: Act.CREATE,
                data:trackT,
                table:'Track'
            }
            __dbClient.send(__id+'addTT',sql);
        }
        __dbClient.addSubscriber(__id+'addTT',this.trackAdded.bind(this));
        
        this.trackRemoved = function(msg){
            delete __tracks[msg.id];
            this.update(this);
        }
        this.removeTrack = function(id){
            let sql = {
                action: Act.DELETE,
                id:id,
                table:'Track'
            }
            __dbClient.send(__id+'Interview_removeTrack',sql);
        }
        __dbClient.addSubscriber(__id+'Interview_removeTrack',this.trackRemoved.bind(this));
        

        this.interviewRemoved = function(){
            this.remove();
            console.log('interview Removed');
        }
        this.removeInterview = function(){
            let sql = {
                action: Act.DELETE,
                id:__id,
                table:'Interview'
            }
//            this.interviewRemoved();
            __dbClient.send(__id+'removeInterview',sql);
        }
        __dbClient.addSubscriber(__id+'removeInterview',this.interviewRemoved.bind(this));


        this.tracksLoaded = function(msg){
            for(let t in msg.data){
                addTrackByType(msg.data[t]);
            }
            this.update(this);
        }
        
        this.loadTracks = function(){
            let sql = {
                action: Act.LOAD,
                table:'Track',
                where: 'int_id='+__id
            }
            __dbClient.send(__id+'loadTracks',sql);
        }
        __dbClient.addSubscriber(__id+'loadTracks',this.tracksLoaded.bind(this));

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
