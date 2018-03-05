import Interval from './Interval.js';

/**************************************
    Interval Text
**************************************/
export default class IntervalText extends Interval{
    constructor(start_s,end){
        super(start_s,end);
        this.type = 'text';
    }
}