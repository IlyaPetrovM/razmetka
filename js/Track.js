import IDbTable from './IDbTable.js';
import Publisher from './Publisher.js';
/**************************************
Track
**************************************/
export default class Track extends Publisher {
    constructor(title_,id,wsClient){
        super(); /// TODO
        this.id = id;
        this.title = title_;
        
        const __id = id;
        var __title = title_;
        var __type = 'Media';
        this.getTitle = function(){return __title;}
        this.getId = function(){return __id};
        
        this.intervals = [];
        this.cnt = 0;
        
        var thistrack = this;
        
        var __intervals = {};
        
        
        this.trackRemoved = function(){
            this.remove();
        }
        this.removeTrack = function(){
            this.trackRemoved();//TODO send
            
        }
        this.intervalAdded = function(ivl){
            //TODO
        }
        this.addInterval = function(ivl){
            //TODO
        }
        
        this.intervalRemoved = function(id){
            //TODO
        }
        this.removeInterval = function(id){
            //TODO
        }
        
        this.intervalsLoaded = function(){
            //TODO
        }
        this.loadIntervals = function(){
            //TODO
        }
        
        this.trackEdited = function(track){
            //TODO
        }
        this.editTrack = function(track){
            //TODO
        }
        
    }
    get table(){
        return 'Interview';
    }
    get sender(){
        return 'Interview'+this.id;
    }
    remove(){
        super.remove(this.id, this.table);
    }
    processDelete(msg){
        console.log('processDelete' + this.id);
        this.ondelete(this.id);
    }


    setTitle(title_){
        while(title_ == undefined || title_ == ''){
            title_ = prompt("Введите название дорожки","Дорожка");
            if(title_ == undefined){
                break;
            }
        }
        this.title = title_;
    }
    intersect(interval,start_s,end_s){
        var A = (interval.start_s < start_s),
                B = (interval.end_s < end_s),
                C = (interval.start_s < end_s),
                D = (interval.end_s < start_s);
        if((A||B||C||D)&&(!A||!B||!C||!D))
        {
            console.log('пересекает');
            return true;
        }
        else{ 
            return false;
        }
    }
    intersectAny(start_s,end_s,index){
        var intersects = false;
        for(var i=0; i < this.intervals.length; i++){
            if(this.intervals[i].index != index){
            if(this.intersect(this.intervals[i], start_s, end_s)){   
                intersects = true;
                break;
            }}
        }
        return intersects;
    }
    moveInterval(index,newstart_s){
        var ivl = this.intervals[index];
        if(!intersectAny(newstart_s,ivl.duration_s(),index)){
            this.intervals[index].start_s = newstart_s;
            this.intervals[index].end_s = ivl.duration_s();
            console.log(this.intervals[index]);
        }else{
            console.log("Перескает!");
        }
    }
    addInterval(_interv){
        if(!this.intersectAny(_interv.start_s,_interv.end_s)){ 
            let leftIvl = this.findLeft(_interv);
            if(leftIvl!=undefined){ // ссылки на соседей
                _interv.leftInterval = leftIvl;
                _interv.rightInterval =  leftIvl.rightInterval;
                leftIvl.rightInterval = _interv;
                console.log(_interv);
            }
            this.intervals.push(_interv);
            this.cnt++;
            return true;
        }else{
            alert("Элементы не должны пересекаться");
            return false;
        }
    }
    findLeft(ivl){
        if(this.intervals.length>0){
            let max_i = 0;
            for(let i=0; i < this.intervals.length; i++){
                if(this.intervals[i].end_s > this.intervals[max_i].end_s && 
                  this.intervals[i].end_s < ivl.end_s)
                    {
                        max_i = i;
                    }
            }
            return this.intervals[max_i];
        }else{
            return undefined;
        }
    }
    deleteInterval(interval){
        console.log("Удалить "+interval.index);
        for(var i = 0; i < this.intervals.length; i++){
            console.log(this.intervals[i].index);
            if(this.intervals[i].index == interval.index){
                this.intervals.splice(i,1);
                break;
            }
        }
    }
}