import Interval from "./Interval.js";

/**************************************
    Interval Media
**************************************/
export default class IntervalMedia extends Interval{
    constructor(path,start_s,end_s){
        super(start_s,end_s);
        this.cursorOn = false;
        this.path = path;
        this.audio = new Audio(path);
        this.audio.load();
        this.textIntervals = new Array();
    }

}