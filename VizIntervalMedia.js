import VizInterval from './VizInterval.js';
/**************************************
 Viz Interval Media
**************************************/
export default class VizIntervalMedia extends VizInterval {
    constructor(parent,data){
        super(parent,data);
        
        document.addEventListener('moveIntervalMediaEvent',this.move.bind(this));
        document.addEventListener('cursorChangePos', this.reactOnCursor.bind(this)); 
        document.addEventListener('motionApprovedMedia',this.move.bind(this));
    }
    
    reactOnCursor(cursorChangePosEvent) {
        let abs_s = cursorChangePosEvent.time_s;
        let rel_s = abs_s - this.viz.interval.start_s;
        if(rel_s > 0 && rel_s < this.viz.interval.audio.duration){
            this.viz.interval.cursorOn = true;
            this.viz.interval.audio.currentTime = rel_s;
        }else{
            this.viz.interval.cursorOn = false;
            this.viz.interval.audio.currentTime = 0;
        }
    }

    move(event) {
        if(this.viz.choosen){
            this.moveTextIntervals(event.step_s);
            this.viz.interval.move(event.step_s);
            this.update();
        }
    }
    
    moveTextIntervals(step_s){
        for(let i=0; i<this.viz.interval.textIntervals.length; i++){
            this.viz.interval.textIntervals[i].viz.interval.move(step_s);
        }
    }
    
    startPlay(){
        super.startPlay();
        this.viz.interval.cursorOn = true;
        this.viz.interval.audio.play();
    }
    
    stopPlay(){
        super.stopPlay();
        this.viz.interval.audio.pause();
    }
}
