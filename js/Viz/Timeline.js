
export default class Timeline {
    constructor(parentNode,controlNode){
        this.div = document.createElement('div');
        this.div.className = 'timeline';
        this.div.id = 'timeline';
        /* Масштабирование */
        this.zoom = document.createElement('input');
        this.zoom.id = 'zoom';
        this.len_s = 60; // !!! Важен порядок! Сперва длина в секундах, а потом уже масштаб!
        this.zoom_px = 10; // !!! Важен порядок! Сперва длина в секундах, а потом уже масштаб!
        this.div.owner = this;
        
        this.zoom.value = 10;
        var thisTimeline = this;
        this.zoom.onmousemove = this.zoom.onchange = function(e){
            thisTimeline.zoom_px = parseInt(e.target.value);
            e.target.title = '1 секунда =' + e.target.value+' пикселей';
        };  

        document.addEventListener('fragmentUpdated',function(e){
            var addition = 1;
            if(e.fragment.type == 'media'){
                addition = 3;
            }
            let end_s = parseInt(e.fragment.end_s) + addition; // 3 is for safety
            if(end_s > thisTimeline.len_s){
                let diff_s = end_s - thisTimeline.len_s;
                thisTimeline.len_s = end_s;
                document.dispatchEvent(new CustomEvent('timelineUpdated'));
            }
        },false);
        
        this.div.onclick = function(e){
                let x_px = e.clientX;            
                let scroll_px = wrapper.scrollLeft;
                let cursor = document.getElementsByClassName('cursor')[0];
                let offset_px = cursor.parentElement.offsetLeft;
                
                let cursorChangePosEvent = new CustomEvent('cursorChangePos');
                cursorChangePosEvent.time_s = (x_px + scroll_px - offset_px - 1)/parseFloat(thisTimeline.zoom.value);
                document.dispatchEvent(cursorChangePosEvent);
        }
        
        this.zoom.type = 'range';
        this.zoom.min = 0.5;

        this.zoom.step = 0.1;
        this.zoom.max = 100;
        
        controlNode.appendChild(this.zoom);
        parentNode.appendChild(this.div);
    }
    set len_s(val_s){
        this.__len_s = val_s; 
        this.div.style.width = (this.__len_s * this.zoom.value)+'px';
        console.log(this.div.style.width);
        console.log(this.__len_s);
    }
    get len_s(){
        return this.__len_s;   
    }
    set zoom_px(val_px){
        this.div.style.width = (val_px * this.len_s)+'px';
    }
}
