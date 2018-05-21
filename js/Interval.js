
"use strict";
import IDbTable from "./IDbTable.js";
/**************************************
    Interval
*************************************/
export default class Interval  {
    constructor(start_s, end_s){
        if(start_s > end_s){
            end_s = start_s + 1;
        }
        this.leftInterval = undefined;
        this.rightInterval = undefined;
        this.start_s = start_s;
        this.end_s = end_s;
        Interval.cnt = (Interval.cnt || 0)+1;
        this.index=Interval.cnt;
        console.log('Создан интервал ',Interval.cnt);
    }
    move(step_s){
        console.log("было",this);
        this.start_s = this.start_s + step_s;
        this.end_s = this.end_s + step_s;
        console.log("стало",this);
    }
    intersectRecursive(left_b){
        if(left_b){
            intersectRecursiveLeft();
        }else{
            intersectRecursiveRight();
        }
    }
    intersectRecursiveLeft(){
        if( !this.intersect(this.leftInterval) ){
            console.log("Пересечения нет, но надо ещё проверить");
            if(this.end_s > this.leftInterval.start_s){
                return false;
            }else{
                return this.leftInterval.intersectRecursiveLeft();
            }
        }
        return true;
    }
    
    intersectRecursiveRight(){
        if( !this.intersect(this.rightInterval) ){
            console.log("Пересечения нет, но надо ещё проверить");
            if(this.start_s < this.rightInterval.end_s){
                return false;
            }else{
                return this.rightInterval.intersectRecursiveRight();
            }
        }
        return true;
    }
    
    intersect(ivl){
        let A = (this.start_s < ivl.start_s),
                B = (this.end_s < ivl.end_s),
                C = (this.start_s < ivl.end_s),
                D = (this.end_s < ivl.start_s);
        if((A||B||C||D)&&(!A||!B||!C||!D))
        {
            console.log('пересекает');
            return true;
        }
        else{ 
            return false;
        }
    }
    set start_s(val){
        this.__start_s = val;
        var intervalUpdatedEvent = new CustomEvent('intervalUpdated');
        intervalUpdatedEvent.interval = this;
        document.dispatchEvent(intervalUpdatedEvent);
    }
    get start_s(){
        return this.__start_s;
    }
    set end_s(val){
        this.__end_s=val;
        var intervalUpdatedEvent = new CustomEvent('intervalUpdated');
        intervalUpdatedEvent.interval = this;
        document.dispatchEvent(intervalUpdatedEvent);
    }
    get end_s(){
        return this.__end_s;
    }
    render(){
        
    }
    duration_s(){
        return this.end_s - this.start_s;
    }
}