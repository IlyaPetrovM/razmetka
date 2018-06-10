import VizFragment from './VizFragment.js';
/**************************************
 Viz Fragment Media
**************************************/
export default class VizFragmentMedia extends VizFragment {
    constructor(parent,data,timeline){
        super(parent,data,timeline);
        
//        document.addEventListener('moveFragmentMediaEvent',this.move.bind(this));
        document.addEventListener('cursorChangePos', this.reactOnCursor.bind(this));
//        document.addEventListener('motionApprovedMedia',this.move.bind(this));


        this.startPlay = function(){
            this.viz.classList.add('playing');
            console.log(this.constructor.name+'::startPlay()');
            this.viz.fragment.cursorOn = true;
            this.viz.fragment.audio.play();
        }

        this.stopPlay = function(){
            this.viz.classList.remove('playing');
            this.viz.fragment.audio.pause();
        }
    }
    
    reactOnCursor(cursorChangePosEvent) {
        let abs_s = cursorChangePosEvent.time_s;
        let rel_s = abs_s - this.viz.fragment.getStartS();
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


}
