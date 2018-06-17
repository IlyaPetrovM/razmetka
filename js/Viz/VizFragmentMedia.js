import VizFragment from './VizFragment.js';
/**************************************
 Viz Fragment Media
**************************************/
export default class VizFragmentMedia extends VizFragment {
    constructor(parent,fragment,timeline, cursorPlay){
        super(parent,fragment,timeline);
        var __cursorPlay = cursorPlay;
//        document.addEventListener('moveFragmentMediaEvent',this.move.bind(this));
//        document.addEventListener('motionApprovedMedia',this.move.bind(this));


        this.startPlay = function(){
            this.viz.classList.add('playing');
            this.viz.fragment.cursorOn = true;
            this.viz.fragment.audio.play();
            __cursorPlay.pushPlayingFragment(fragment);
        }

        this.stopPlay = function(){
            console.log('stopPlay');
            this.viz.classList.remove('playing');
            this.viz.fragment.audio.pause();
            if(__cursorPlay.getPosS() > fragment.getEndS()){
                __cursorPlay.removePlayingFragment(fragment);
                this.viz.classList.remove('cursorOn');
                this.viz.fragment.cursorOn = false;
            }
        }

        this.reactOnCursor = function(cursorChangePosEvent) {
            let abs_s = cursorChangePosEvent.time_s;
            let rel_s = abs_s - this.viz.fragment.getStartS();
            if(rel_s > 0 && rel_s < this.viz.fragment.audio.duration){
                this.viz.classList.add('cursorOn');
                this.viz.fragment.cursorOn = true;
                this.viz.fragment.audio.currentTime = rel_s;
                __cursorPlay.pushPlayingFragment(fragment);
            }else{

                this.viz.classList.remove('cursorOn');
                this.viz.fragment.cursorOn = false;
                this.viz.fragment.audio.currentTime = 0;
            }
        }
        document.addEventListener('cursorChangePos', this.reactOnCursor.bind(this));
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
