
"use strict";
//import IDbTable from "./IDbTable.js";
import Publisher from './Publisher.js';
const Act = new exports.Act();
/**************************************
    Fragment
*************************************/
export default class Fragment extends Publisher {
    constructor(id, start_s, end_s, track_id,interview_id,dbClient){
        super();
        var __start_s = start_s,
            __end_s = end_s,
            __track_id = track_id,
            __dbClient = dbClient;
        const __id = id,
              __interview_id = interview_id;

        this.getEndS = function(){
            return __end_s;
        }
        this.getStartS = function(){
            return __start_s;
        }
        this.startSet = function(msg){
            __start_s = parseFloat(msg.data.start_s);
            this.update(this);
        }
        this.getTableName = function(){
            throw Error('abstract method used');
        }
        this.setStartS = function(sec){
            let sql = {
                action: Act.UPDATE,
                table: this.getTableName(), //TODO getTableName
                id: __id,
                data: {start_s: sec}
            };
            __dbClient.send(__id+(__track_id+'setStart'),sql);
        }
        __dbClient.addSubscriber(__id+(__track_id+'setStart'),this.startSet.bind(this));

        this.endSet = function(msg){
            __end_s = parseFloat(msg.data.end_s);
            this.update(this);
        }
        this.setEndS = function(sec){
            if(sec<0) sec = 0.0;
            let sql = {
                action: Act.UPDATE,
                table: this.getTableName(),
                id: __id,
                data: {end_s: sec}
            };
            __dbClient.send(__id+'_'+(__track_id+'setEnd'),sql);
        }
        __dbClient.addSubscriber(__id+'_'+(__track_id+'setEnd'),this.endSet.bind(this));
        
        
        
        this.getTrackId = function(){
            return __track_id;
        }
        
        this.getId = function(){
            return __id;
        }
        this.getInterviewId = function(){
            return __interview_id;
        }



        if(start_s > end_s){
            end_s = start_s + 1;
        }
        this.leftFragment = undefined;
        this.rightFragment = undefined;

        this.index=__id;
        this.duration_s = function(){
            return this.getEndS() - this.getStartS();
        }
//        console.log('Создан интервал ',Fragment.cnt);
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
        if( !this.intersect(this.leftFragment) ){
            console.log("Пересечения нет, но надо ещё проверить");
            if(this.end_s > this.leftFragment.start_s){
                return false;
            }else{
                return this.leftFragment.intersectRecursiveLeft();
            }
        }
        return true;
    }
    
    intersectRecursiveRight(){
        if( !this.intersect(this.rightFragment) ){
            console.log("Пересечения нет, но надо ещё проверить");
            if(this.start_s < this.rightFragment.end_s){
                return false;
            }else{
                return this.rightFragment.intersectRecursiveRight();
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
//    set start_s(val){
//        this.__start_s = val;
//        var fragmentUpdatedEvent = new CustomEvent('fragmentUpdated');
//        fragmentUpdatedEvent.fragment = this;
//        document.dispatchEvent(fragmentUpdatedEvent);
//    }
//    get start_s(){
//        return this.__start_s;
//    }
//    set end_s(val){
//        this.__end_s=val;
//        var fragmentUpdatedEvent = new CustomEvent('fragmentUpdated');
//        fragmentUpdatedEvent.fragment = this;
//        document.dispatchEvent(fragmentUpdatedEvent);
//    }
//    get end_s(){
//        return this.__end_s;
//    }
    render(){
        
    }

}
