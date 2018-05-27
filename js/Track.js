import IDbTable from './IDbTable.js';
import Publisher from './Publisher.js';
/**************************************
Track
**************************************/
export default class Track extends Publisher {
    constructor(title_, id, interview_id, wsClient){
        super(); /// TODO
        this.id = id;
        this.title = title_;
        
        const __id = id,
              __interview_id = interview_id;
        var __title = title_;
        var __type = 'Media';
        var __fragments = {};
        this.getTitle = function(){return __title;}
        this.getId = function(){return __id};
        this.getInterviewId = function(){return __interview_id};
        this.getFragments = function(){return __fragments;}
        this.fragments = [];
        this.cnt = 0;
        
        var thistrack = this;
        
        
        
        this.trackRemoved = function(){
            this.remove();
        }
        this.removeTrack = function(){
            this.trackRemoved();//TODO send
            
        }
        this.fragmentAdded = function(ivl){
            //TODO
        }
        this.addFragment = function(ivl){
            //TODO
        }
        
        this.fragmentRemoved = function(id){
            //TODO
        }
        this.removeFragment = function(id){
            //TODO
        }
        
        this.fragmentsLoaded = function(fragments){
            console.warn('abstract method used');
        }
        this.loadFragments = function(){
            console.warn('abstract method used');
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
    intersect(fragment,start_s,end_s){
        var A = (fragment.start_s < start_s),
                B = (fragment.end_s < end_s),
                C = (fragment.start_s < end_s),
                D = (fragment.end_s < start_s);
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
        for(var i=0; i < this.fragments.length; i++){
            if(this.fragments[i].index != index){
            if(this.intersect(this.fragments[i], start_s, end_s)){   
                intersects = true;
                break;
            }}
        }
        return intersects;
    }
    moveFragment(index,newstart_s){
        var ivl = this.fragments[index];
        if(!intersectAny(newstart_s,ivl.duration_s(),index)){
            this.fragments[index].start_s = newstart_s;
            this.fragments[index].end_s = ivl.duration_s();
            console.log(this.fragments[index]);
        }else{
            console.log("Перескает!");
        }
    }
    addFragment(_interv){
        if(!this.intersectAny(_interv.start_s,_interv.end_s)){ 
            let leftIvl = this.findLeft(_interv);
            if(leftIvl!=undefined){ // ссылки на соседей
                _interv.leftFragment = leftIvl;
                _interv.rightFragment =  leftIvl.rightFragment;
                leftIvl.rightFragment = _interv;
                console.log(_interv);
            }
            this.fragments.push(_interv);
            this.cnt++;
            return true;
        }else{
            alert("Элементы не должны пересекаться");
            return false;
        }
    }
    findLeft(ivl){
        if(this.fragments.length>0){
            let max_i = 0;
            for(let i=0; i < this.fragments.length; i++){
                if(this.fragments[i].end_s > this.fragments[max_i].end_s && 
                  this.fragments[i].end_s < ivl.end_s)
                    {
                        max_i = i;
                    }
            }
            return this.fragments[max_i];
        }else{
            return undefined;
        }
    }
    deleteFragment(fragment){
        console.log("Удалить "+fragment.index);
        for(var i = 0; i < this.fragments.length; i++){
            console.log(this.fragments[i].index);
            if(this.fragments[i].index == fragment.index){
                this.fragments.splice(i,1);
                break;
            }
        }
    }
}