import TimeString from '../TimeString.js';
export default class TimeDisplay{
    constructor(cursorParent,timeParent){
        
        var mouseCursorTimeDisplay = document.createElement('p');
        mouseCursorTimeDisplay.id = 'mouseCursorTimeDisplay';
        mouseCursorTimeDisplay.this = this;
        mouseCursorTimeDisplay.innerHTML = '00:00:00.000';
        var playCursorDisplay = document.createElement('p');
        playCursorDisplay.id = 'playCursorDisplay';
        playCursorDisplay.this = this;
        playCursorDisplay.innerHTML = '00:00:00.000';
        
        var cursor = document.createElement('div');
        cursor.className='cursor';
        cursorParent.addEventListener('mousemove',function (e) {
            let x_px = e.pageX;
            let scroll_px = wrapper.scrollLeft;
            let cursor = document.getElementsByClassName('cursor')[0];
            let offset_px = cursor.parentElement.offsetLeft;
            cursor.style.left = (x_px - offset_px - 1) + 'px';
            let s = (x_px + scroll_px - offset_px - 1)/parseFloat(zoom.value);
            mouseCursorTimeDisplay.innerText = TimeString.sec2str(s);
        },false);
        document.addEventListener('cursorChangePos',function(e){
                playCursorDisplay.innerText = TimeString.sec2str(e.time_s);
        });
        timeParent.appendChild(mouseCursorTimeDisplay);
        timeParent.appendChild(playCursorDisplay);
        cursorParent.appendChild(cursor);
    }

}
