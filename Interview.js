/**************************************
    Interview
**************************************/
import VizInterview from './VizInterview.js';
import IDbTable from './IDbTable.js';
import TrackMedia from './TrackMedia.js';
import TrackText from './TrackText.js';
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
        this.trackMediaCreated = function(){};
        this.trackTextCreated = function(){};
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
    
    remove(){
        super.remove(this.id, this.table);
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
        this.viz = new VizInterview(parentNode,this);
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
                this.tracks.push(track);
                this.trackMediaCreated(track);
                console.log('4....load Interview');
                console.log(this.tracks);
                break;
            case 'Text':
                var track  = new TrackText(data.title, data.id);
                this.tracks.push(track);
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