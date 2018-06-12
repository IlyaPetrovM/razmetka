import VizFragment from './VizFragment.js';
import TimeString from '../TimeString.js';
import TimeField from './TimeField.js';
/**************************************
 Viz Fragment Text
**************************************/
export default class VizFragmentText extends VizFragment {
    
    constructor(parent, data, media, timeline,parentDescr){
        super(parent, data, timeline);

        var __fragment = data;
        var __timeline = timeline;
        this.media = data.getMedia();
//        this.media.textFragments.push(this); // Удобно потом двигать текстовый интервал из медиа

        this.textDescr = document.createElement('div');
        this.textDescr.setAttribute('contenteditable',true); 
        /// TODO !!!!! Нужно каким-то образом вызывать метод изменения описания фрагмента!!!!!! 2018.06.13 2:22
        this.textDescr.setAttribute('tabindex','-1'); 

        this.textDescr.id = ('textDiscr');
        this.textDescr.className = 'textDescr';
        this.textDescr.innerHTML = data.getDescr();
        
        this.ivlDescr = document.createElement('div');
        this.ivlDescr.className = 'ivlDescr';

        this.viz.addEventListener('mouseover',this.scrollTo.bind(this.ivlDescr));   
        this.viz.addEventListener('mouseleave',this.scrollTo.bind(this.ivlDescr));
        this.ivlDescr.addEventListener('mouseover',this.scrollTo.bind(this.viz));
        this.ivlDescr.addEventListener('mouseleave',this.scrollTo.bind(this.viz));

        var __start = new TimeField(this.ivlDescr,__fragment,__fragment.getStartS),
            __end = new TimeField(this.ivlDescr,__fragment,__fragment.getEndS);
        __fragment.addSubscriber(__start);
        __fragment.addSubscriber(__end);
        __start.onChange = function(time_s){
            __fragment.setStartS(time_s);
        }
        __end.onChange = function(time_s){
            __fragment.setEndS(time_s);
        }

        this.ivlDescr.appendChild(this.textDescr);
        parentDescr.appendChild(this.ivlDescr);
//        this.textDescr.focus();
        this.focus = function(){
            this.textDescr.focus();
        }
    }
//    move(e) {
//        if(this.media.index == e.index){    
//            let moveFragmentTextEvent =new CustomEvent('moveFragment');
//            moveFragmentTextEvent.step_s = e.step_s;
//            document.dispatchEvent(moveFragmentTextEvent);        
//        }
//    }

    scrollTo() {
        this.classList.toggle('hover');
        /// FIXME фокус работает слишком как-то странно иногда
        this.scrollIntoView(true);
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
