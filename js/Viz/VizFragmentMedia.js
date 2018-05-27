import VizFragment from './VizFragment.js';
/**************************************
 Viz Fragment Media
**************************************/
export default class VizFragmentMedia extends VizFragment {
    constructor(parent,data){
        super(parent,data);
        
        document.addEventListener('moveFragmentMediaEvent',this.move.bind(this));
        document.addEventListener('cursorChangePos', this.reactOnCursor.bind(this)); 
        document.addEventListener('motionApprovedMedia',this.move.bind(this));
    }
    
    reactOnCursor(cursorChangePosEvent) {
        let abs_s = cursorChangePosEvent.time_s;
        let rel_s = abs_s - this.viz.fragment.start_s;
        if(rel_s > 0 && rel_s < this.viz.fragment.audio.duration){
            this.viz.fragment.cursorOn = true;
            this.viz.fragment.audio.currentTime = rel_s;
        }else{
            this.viz.fragment.cursorOn = false;
            this.viz.fragment.audio.currentTime = 0;
        }
    }

    move(event) {
        if(this.viz.choosen){
            this.moveTextFragments(event.step_s);
            this.viz.fragment.move(event.step_s);
            this.update();
        }
    }
    
    moveTextFragments(step_s){
        for(let i=0; i<this.viz.fragment.textFragments.length; i++){
            this.viz.fragment.textFragments[i].viz.fragment.move(step_s);
        }
    }
    
    startPlay(){
        super.startPlay();
        this.viz.fragment.cursorOn = true;
        this.viz.fragment.audio.play();
    }
    
    stopPlay(){
        super.stopPlay();
        this.viz.fragment.audio.pause();
    }
}
