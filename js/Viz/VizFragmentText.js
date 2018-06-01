import VizFragment from './VizFragment.js';
import TimeDisplay from './TimeDisplay.js';
/**************************************
 Viz Fragment Text
**************************************/
export default class VizFragmentText extends VizFragment {
    
    constructor(parent, data, media){
        super(parent, data);
        console.log(data!==undefined,'fragment text is undef');
        this.media = data.getMedia();
//        this.media.textFragments.push(this); // Удобно потом двигать текстовый интервал из медиа
        
        this.timeFieldStart = document.createElement('time');
        this.timeFieldEnd = document.createElement('time');
        
        this.textDescr = document.createElement('div');
        this.textDescr.setAttribute('contenteditable',true); 
        this.textDescr.className = 'textDescr';
        this.textDescr.innerHTML = data.getDescr();
        
        this.textDescr.focus();
        console.log('focus');
        
        this.timeFieldStart.className = 'timeField';      
        this.timeFieldEnd.className = 'timeField';  
        
        
        this.ivlDescr = document.createElement('div');
        this.ivlDescr.className = 'ivlDescr';
        this.ivlDescr.appendChild(this.timeFieldStart);
        this.ivlDescr.appendChild(this.timeFieldEnd);
        this.ivlDescr.appendChild(this.textDescr);
        descr.appendChild(this.ivlDescr);
        
        this.update();

        this.viz.addEventListener('mouseover',this.scrollTo.bind(this.ivlDescr));   
        this.viz.addEventListener('mouseleave',this.scrollTo.bind(this.ivlDescr));
        this.ivlDescr.addEventListener('mouseover',this.scrollTo.bind(this.viz));
        this.ivlDescr.addEventListener('mouseleave',this.scrollTo.bind(this.viz));

//        this.onUpdate()
    }
//    
//    move(e) {
//        if(this.media.index == e.index){    
//            let moveFragmentTextEvent =new CustomEvent('moveFragment');
//            moveFragmentTextEvent.step_s = e.step_s;
//            document.dispatchEvent(moveFragmentTextEvent);        
//        }
//    }

    scrollTo() {
        this.classList.toggle('hover');
        this.scrollIntoView(false);
    }

    moveReally(e) {
        this.viz.fragment.start_s += parseFloat(e.step_s);
        this.viz.fragment.end_s += parseFloat(e.step_s);
        this.update();
    }

    
    update(){
        super.update();
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
