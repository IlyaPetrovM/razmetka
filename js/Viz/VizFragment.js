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
        var offset_px, zero_px;
        var moving = false;
        
        var endTrack = function(e){
            if(moving){
                moving = false;
                var zoom_px = parseFloat(document.getElementById('zoom').value);
                let x_px = parseFloat(this.viz.style.left);
                let width_px = parseFloat(this.viz.style.width);
                let start_s = x_px/zoom_px;
                let end_s = (x_px+width_px)/zoom_px;
                __fragment.editFragment(start_s,end_s);
            }
        };

        this.viz.onmousedown = function(e){
//            console.log(e.clientX);
            offset_px = parseInt(this.viz.style.left)-e.clientX;
            moving = true;
        }.bind(this);

        window.addEventListener('mouseup',endTrack.bind(this));
        this.viz.onmousemove = function(e){
            if(moving){
                this.viz.style.left = (offset_px + e.clientX )+'px';
            }
        }.bind(this);
        this.viz.onmouseout = endTrack.bind(this);


//        this.viz.onclick = function(e){
//            if(!__menu){
//                this.viz.classList.toggle('choosen');
//                __menu = new MenuFragmentControls(parentNode, this.viz, __fragment);
//            }else{
//                this.viz.classList.toggle('choosen');
//                __menu.removeMe();
//                __menu = null;
//            }
//            console.log('press fragment',fragment.getId());
//        }.bind(this);

        var redraw = function(frg) {
//            console.log('after motion');
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
        this.startPlay = function(){
            this.viz.classList.add('playing');
        }
        this.stopPlay = function(){
            this.viz.classList.remove('playing');
        }
        this.highlight = function(cursorPlaysEvent){
            var cursPos_s = cursorPlaysEvent.cursorPos_s;
            var fragmentLeft_s = __fragment.getStartS(); // FIXME
            var fragmentRight_s = __fragment.getEndS(); // FIXME
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

        this.unHighlight = function(){
            this.plays=false;
            this.stopPlay();
        }
//        document.addEventListener('fragmentUpdated',this.update.bind(this));
        document.addEventListener('cursorPlays',this.highlight.bind(this));
        document.addEventListener('stopPlaying',this.unHighlight.bind(this));
        document.addEventListener('moveFragment',this.checkIntersect.bind(this));


//        document.addEventListener('timelineUpdated',this.update.bind(this));
    }


    checkIntersect(e) {
        if(this.viz.choosen){
            var evIntrs = new CustomEvent('checkIntersect');
            evIntrs.media = this.viz.fragment;
            evIntrs.step_s = + parseFloat(e.step_s); //????
            document.dispatchEvent(evIntrs);
        }
    }


    updateEvt(e){
        if(e.fragment === this.viz.fragment){
            this.update();
        }
    }

}
