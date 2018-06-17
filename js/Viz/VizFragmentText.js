import VizFragment from './VizFragment.js';
import TimeString from '../TimeString.js';
import TimeField from './TimeField.js';
/**************************************
 Viz Fragment Text
**************************************/
export default class VizFragmentText extends VizFragment {
    
    constructor(parent, data, media, timeline, descriptionBar){
        super(parent, data, timeline);

        var __fragment = data;
        var __timeline = timeline;
        var __bar;
        this.setDescriptionBar = function(bar){
            __bar = bar;
            this.viz.addEventListener('mouseover',__bar.scrollIntoView);
            this.viz.addEventListener('mouseleave',__bar.scrollIntoView);
        }
        var __viz = this.viz;
        this.scrollIntoView = function(){
            __viz.scrollIntoView(false);
            __viz.classList.toggle('hover');
        }

    }

    moveReally(e) {
        this.viz.fragment.start_s += parseFloat(e.step_s);
        this.viz.fragment.end_s += parseFloat(e.step_s);
        this.update();
    }

    
    update(){
//        super.update();
        if(this.timeFieldStart){
            this.timeFieldStart.innerText= TimeDisplay.sec2str(this.viz.fragment.start_s);
            this.timeFieldEnd.innerText= TimeDisplay.sec2str(this.viz.fragment.end_s);
        }
    }
    startPlay(){
        super.startPlay();
//        console.log('Текстовый интервал: показать');
    }
    stopPlay(){
        super.stopPlay();
//        console.log('Текстовый материал: завершить');
    }
}
