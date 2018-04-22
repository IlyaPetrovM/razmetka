import IDbTable from './IDbTable.js';
/**************************************
Track
**************************************/
export default class Track {
    constructor(title_,id){
        this.id = id;
        this.title = title_;
        this.intervals = [];
        this.cnt = 0;
        var thistrack = this;
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