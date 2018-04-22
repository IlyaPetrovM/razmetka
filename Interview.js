/**************************************
    Interview
**************************************/
import VizInterview from './VizInterview.js';
import IDbTable from './IDbTable.js';
import TrackMedia from './TrackMedia.js';
export default class Interview extends IDbTable{
    constructor(_title, _date, wsClient,id_){
        super(wsClient);
        this.title = _title;
        this.id = id_;
        this._date = _date;
        this.tracks = [];
        this.onidupdated = function(newid){};
        this.onupdate = function(){};
        this.ondelete = function(){};
    }
    get table(){
        return 'Interview';
    }
    get sender(){
        return 'Interview'+this.id;
    }
    

    create(){
        //TODO 09.04.2018
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
    
    remove(){
        super.remove(this.id, this.table);
    }
    processDelete(msg){
        //TODO 09.04.2018
        console.log('processDelete' + this.id);
        this.ondelete(this.id);
    }
    processError(){
        //TODO 09.04.2018
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
        this.load();
        this.viz = new VizInterview(parentNode,this);
    }
    
    hide(){
        this.viz.hide();
        delete this.viz;
    }
    
    
    get name(){
        return "Interview";
    }
    
    load(){
        super.load(this.table);
    }
    
    processLoad(msg){
        console.log('pass');
    }
    
    addTrackMedia(track){
        super.create({title:track.title,_type:'Media',int_id:this.id},'Track');
    }
    addTrackText(track){
        //TODO addTrackText
        console.log('todo me');
    }
    processCreate(msg){
        //TODO 09.04.2018
        if(msg.table === 'Track'){
        switch(msg.data._type){
            case 'Media':
                this.tracks.push(new TrackMedia(msg.data.title, msg.data.id));
                console.log(this.tracks);
                // TODO VizTrackMedia
            break;
            case 'Text':
                this.tracks.push(new TrackText(msg.data.title, msg.data.id));
                //TODO VizTrackText
                break;
        }}
//        if(this.id===undefined){
//            this.id = msg.data.id;
//            console.log(msg);
//            this.onidupdated(this.id);
//        }
    }
}  