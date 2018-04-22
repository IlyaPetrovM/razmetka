
/**************************************
 Viz Interval
**************************************/
export default class VizInterval {
    constructor(parentNode, data){
        this.viz = document.createElement('div');
        this.viz.className = 'interv';
        this.viz.interval = data;
        this.viz.title = data.index;
        
        parentNode.appendChild(this.viz);
        
        this.plays = false;
        var played = false;
        this.viz.choosen = false;
        this.update();
        
        document.addEventListener('intervalUpdated',this.update.bind(this));
        document.addEventListener('cursorPlays',this.highlight.bind(this));
        document.addEventListener('stopPlaying',this.unHighlight.bind(this));
        document.addEventListener('moveInterval',this.checkIntersect.bind(this));
        document.addEventListener('timelineUpdated',this.update.bind(this));
    }
    
    highlight(cursorPlaysEvent){
        var cursPos_s = cursorPlaysEvent.cursorPos_s; 
        var intervalLeft_s = this.viz.interval.start_s;
        var intervalRight_s = this.viz.interval.end_s;
        if(!this.plays){
            if(cursPos_s >= intervalLeft_s && cursPos_s <= intervalRight_s){
                this.plays = true;
                this.startPlay();
            }
        }else{
            if(cursPos_s >=intervalRight_s){
                this.plays = false;
                this.stopPlay();
            }
        }
    }

    checkIntersect(e) {
        if(this.viz.choosen){
            var evIntrs = new CustomEvent('checkIntersect');
            evIntrs.media = this.viz.interval;
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
        if(e.interval === this.viz.interval){
            this.update();
        }
    }
    update(){
        
            var W_px = parseFloat(this.viz.parentElement.clientWidth);
            var zoom_px = parseFloat(document.getElementById('zoom').value);
            this.viz.style.left = this.viz.interval.start_s * zoom_px * 100.0 / W_px + '%';
            this.viz.style.width = this.viz.interval.duration_s() * zoom_px * 100.0 / W_px + '%';
    }
}