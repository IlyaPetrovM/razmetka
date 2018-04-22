import VizInterval from './VizInterval.js';
import TimeDisplay from './TimeDisplay.js';
/**************************************
 Viz Interval Text
**************************************/
export default class VizIntervalText extends VizInterval {
    
    constructor(parent, data, media){
        super(parent, data);
        this.media = media;
        this.media.textIntervals.push(this); // Удобно потом двигать текстовый интервал из медиа
        
        this.timeFieldStart = document.createElement('time');
        this.timeFieldEnd = document.createElement('time');
        
        this.textDescr = document.createElement('div');
        this.textDescr.setAttribute('contenteditable',true); 
        this.textDescr.className = 'textDescr';
        
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
    }
//    
//    move(e) {
//        if(this.media.index == e.index){    
//            let moveIntervalTextEvent =new CustomEvent('moveInterval');
//            moveIntervalTextEvent.step_s = e.step_s;
//            document.dispatchEvent(moveIntervalTextEvent);        
//        }
//    }

    scrollTo() {
        this.classList.toggle('hover');
        this.scrollIntoView(false);
    }

    moveReally(e) {
        this.viz.interval.start_s += parseFloat(e.step_s);
        this.viz.interval.end_s += parseFloat(e.step_s);
        this.update();
    }

    
    update(){
        super.update();
        if(this.timeFieldStart){
            this.timeFieldStart.innerText= TimeDisplay.sec2str(this.viz.interval.start_s);
            this.timeFieldEnd.innerText= TimeDisplay.sec2str(this.viz.interval.end_s);
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
