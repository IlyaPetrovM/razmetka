import Subscriber from '../Subscriber.js';
import MenuFragmentControls from './MenuFragmentControls.js';
/**************************************
 Viz Fragment
**************************************/
export default class VizFragment extends Subscriber{
    constructor(parentNode, fragment, timeline){
        super();
        var __timeline = timeline;

        var __fragment = fragment;
        

        this.viz = document.createElement('div');
        this.viz.className = 'interv';
        this.viz.fragment = fragment;
        this.viz.title = fragment.getId();
        
        parentNode.appendChild(this.viz);
        
        this.plays = false;
        var played = false;
        this.viz.choosen = false;
//        this.update();
        var __menu;
        
        this.viz.onclick = function(e){
            if(!__menu){
                this.viz.classList.toggle('choosen');
                __menu = new MenuFragmentControls(parentNode, this.viz, __fragment);
            }else{
                this.viz.classList.toggle('choosen');
                __menu.removeMe();
                __menu = null;
            }
            console.log('press fragment',fragment.getId());
        }.bind(this);

        var redraw = function(frg) {
            var zoom_px = parseFloat(document.getElementById('zoom').value);
            this.viz.style.left = frg.getStartS() * zoom_px/* * 100.0 / W_px + */+'px';
            this.viz.style.width = frg.duration_s() * zoom_px/* * 100.0 / W_px */+ 'px';
        }

        this.timelineUpdated = function(frg){
            redraw.call(this,frg);
        }
        this.onUpdate = function(frg){
            redraw.call(this,frg);
            __timeline.update(frg,this);
        }
//        document.addEventListener('fragmentUpdated',this.update.bind(this));
        document.addEventListener('cursorPlays',this.highlight.bind(this));
        document.addEventListener('stopPlaying',this.unHighlight.bind(this));
        document.addEventListener('moveFragment',this.checkIntersect.bind(this));
//        document.addEventListener('timelineUpdated',this.update.bind(this));
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

}
