
/**************************************
 Viz Fragment
**************************************/
export default class VizFragment {
    constructor(parentNode, data){
        this.viz = document.createElement('div');
        this.viz.className = 'interv';
        this.viz.fragment = data;
        this.viz.title = data.index;
        
        parentNode.appendChild(this.viz);
        
        this.plays = false;
        var played = false;
        this.viz.choosen = false;
        this.update();
        
        document.addEventListener('fragmentUpdated',this.update.bind(this));
        document.addEventListener('cursorPlays',this.highlight.bind(this));
        document.addEventListener('stopPlaying',this.unHighlight.bind(this));
        document.addEventListener('moveFragment',this.checkIntersect.bind(this));
        document.addEventListener('timelineUpdated',this.update.bind(this));
    }
    
    highlight(cursorPlaysEvent){
        var cursPos_s = cursorPlaysEvent.cursorPos_s; 
        var fragmentLeft_s = this.viz.fragment.start_s;
        var fragmentRight_s = this.viz.fragment.end_s;
        if(!this.plays){
            if(cursPos_s >= fragmentLeft_s && cursPos_s <= fragmentRight_s){
                this.plays = true;
                this.startPlay();
            }
        }else{
            if(cursPos_s >=fragmentRight_s){
                this.plays = false;
                this.stopPlay();
            }
        }
    }

    checkIntersect(e) {
        if(this.viz.choosen){
            var evIntrs = new CustomEvent('checkIntersect');
            evIntrs.media = this.viz.fragment;
            evIntrs.step_s = + parseFloat(e.step_s); //????
            document.dispatchEvent(evIntrs);
        }
    }

    unHighlight() {
        this.plays=false;
        this.stopPlay();
    }
    startPlay(){
        this.viz.classList.add('playing');
    }
    stopPlay(){
        this.viz.classList.remove('playing');
    }
    updateEvt(e){
        if(e.fragment === this.viz.fragment){
            this.update();
        }
    }
    update(){
        
            var W_px = parseFloat(this.viz.parentElement.clientWidth);
            var zoom_px = parseFloat(document.getElementById('zoom').value);
            this.viz.style.left = this.viz.fragment.start_s * zoom_px * 100.0 / W_px + '%';
            this.viz.style.width = this.viz.fragment.duration_s() * zoom_px * 100.0 / W_px + '%';
    }
}