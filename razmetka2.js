/*
FIXME:
 0.05 Запретить перетаскивать курсор пока идёт маркировка (не далее начала создаваемого интервала)
 0.06 Текстовые Интервалы заезжают на кружочки выбора дорожки, описание интервала и фрагмент на дорожке синхронно подсвечиваются
 - Если аудио очень большое, то есть 2-3 часа, то изменение масштаба таймлинии сильно тормозит процесс (долго работает)
 - Текстовые интервалы привязать к аудио
 - При остановке аудиозаписи а затем воспроизведении, воспроизведение начинается с начала (если воспроизведение с маркировкой), а если воспроизведение без маркировки, то продолжает воспроизводится с того места, где остановили (не зависит от положения курсора)
Пожелания:
 --- Прослушать выбранный интервал (не обязательно переходить курсором на него!)
 - Удаление любого интервала
 - Переделать Кнопку "Маркировать" (опустить карандаш) 
 - Кнопки "Вернуться на N секунд" 
 - Функция "Объединить указанные интервалы"
 - Отрезать кусочек интервала и присоединить его к следующему
 - Продолжить описывать выделенный интервал
 
*/
"use strict";
var body = document.getElementsByTagName("body")[0];


/**************************************
    Interval
*************************************/
class Interval {
    constructor(start_s, end_s){
        if(start_s > end_s){
            end_s = start_s + 1;
        }
        this.start_s = start_s;
        this.end_s = end_s;
        Interval.cnt = (Interval.cnt || 0)+1;
        this.index=Interval.cnt;
        console.log('Создан интервал ',Interval.cnt);
        
    }
    set start_s(val){
        this.__start_s = val;
        var intervalUpdatedEvent = new CustomEvent('intervalUpdated');
        intervalUpdatedEvent.interval = this;
        setTimeout(function(){document.dispatchEvent(intervalUpdatedEvent);},0);
    }
    get start_s(){
        return this.__start_s;
    }
    set end_s(val){
        this.__end_s=val;
        var intervalUpdatedEvent = new CustomEvent('intervalUpdated');
        intervalUpdatedEvent.interval = this;
        setTimeout(function(){document.dispatchEvent(intervalUpdatedEvent);},0);
    }
    get end_s(){
        return this.__end_s;
    }
    duration_s(){
        return this.end_s - this.start_s;
    }
}

/**************************************
    Interval Media
**************************************/
class IntervalMedia extends Interval{
    constructor(path,start_s,end_s){
        super(start_s,end_s);
        this.path = path;
        this.audio = new Audio(path);
        this.audio.load();
        this.type = 'media';
    }
}
    
/**************************************
    Interval Text
**************************************/
class IntervalText extends Interval{
    constructor(start_s,end){
        super(start_s,end);
        this.type = 'text';
    }
}


/**************************************
 Viz Interval
**************************************/
class VizInterval {
    constructor(parentNode,data){
        
        this.viz=document.createElement('div');
        this.viz.className = 'interv';
        this.viz.interval = data;
        this.viz.title = data.index;
        parentNode.appendChild(this.viz);
        var plays=false;
        var played=false;
        var thisInterval = this;
        this.viz.choosen=false;
        document.addEventListener('cursorPlays',
            function(event){
                var cursPos = parseFloat(event.cursorPos_pc); 
                    var intervalLeft = parseFloat(thisInterval.viz.style.left);
                    var intervalRight = intervalLeft +
                                        parseFloat(thisInterval.viz.style.width);
                if(!plays){
                    if(cursPos >=intervalLeft && cursPos <= intervalRight){
                        plays=true;
                        thisInterval.startPlay();
                    }
                }else{
                    if(cursPos >=intervalRight){
                        plays=false;
                        thisInterval.stopPlay();
                    }
                }
            },false);
        this.update();
        document.addEventListener('stopPlaying',function(){plays=false;thisInterval.stopPlay();},false);
        document.addEventListener('moveInterval',function(e){
            if(thisInterval.viz.choosen){
                var evIntrs = new CustomEvent('checkIntersect');
                evIntrs.index = thisInterval.viz.interval.index;
                evIntrs.start_s = parseFloat(thisInterval.viz.interval.start_s) + parseFloat(e.step_s);
                evIntrs.end_s = parseFloat(thisInterval.viz.interval.end_s) + parseFloat(e.step_s);
                console.log('moveInterval',e,evIntrs,thisInterval.viz.interval.start_s);
                document.dispatchEvent(evIntrs);
            }
        },false);
        document.addEventListener('resizeInterval',function(e){
            if(thisInterval.viz.resize){
                var evIntrs = new CustomEvent('checkIntersect');
                evIntrs.index = thisInterval.viz.interval.index;
                evIntrs.start_s = thisInterval.viz.interval.start_s;
                evIntrs.end_s = thisInterval.viz.interval.end_s + e.step_s;
                document.dispatchEvent(evIntrs);
            }
        },false);
        document.addEventListener('motionApproved',function(e){
            if(thisInterval.viz.interval.index == e.index){
                thisInterval.viz.interval.start_s = parseFloat(e.start_s);
                thisInterval.viz.interval.end_s = parseFloat(e.end_s);
                thisInterval.update();
                console.log('motionApproved',e,thisInterval.viz.interval.start_s);
            }
        },false)
        document.addEventListener('timelineUpdated',function(){
            thisInterval.update();
        },false);
    }
    startPlay(){
        this.viz.classList.add('playing');
    }
    stopPlay(){
        this.viz.classList.remove('playing');
    }
    update(){
        var W_px = parseFloat(this.viz.parentElement.clientWidth);
        var zoom_px = parseFloat(document.getElementById('zoom').value);
        this.viz.style.left = this.viz.interval.start_s * zoom_px * 100.0 / W_px + '%';
        this.viz.style.width = this.viz.interval.duration_s() * zoom_px * 100.0 / W_px + '%';
    }
}
/**************************************
 Viz Interval Media
**************************************/
class VizIntervalMedia extends VizInterval {
    constructor(parent,data){
        super(parent,data);
    }
    startPlay(time){
        super.startPlay();
        this.viz.interval.audio.currentTime = parseFloat(cursorPlay.style.left)-parseFloat(this.viz.style.left);
        this.viz.interval.audio.play();
    }
    stopPlay(){
        super.stopPlay();
        this.viz.interval.audio.pause();
    }
}

/**************************************
 Viz Interval Text
**************************************/
class VizIntervalText extends VizInterval {
    constructor(parent,data){
        super(parent,data);
        this.ivlDescr = document.createElement('div');
        this.timeFieldStart = document.createElement('time');
        this.timeFieldEnd = document.createElement('time');
        this.textDescr = document.createElement('div');
        this.textDescr.setAttribute('contenteditable',true); 
        this.ivlDescr.className='ivlDescr';
        this.timeFieldStart.className='timeField';      
        this.timeFieldEnd.className='timeField';  
        this.textDescr.className='textDescr';
        this.ivlDescr.appendChild(this.timeFieldStart);
        this.ivlDescr.appendChild(this.timeFieldEnd);
        this.ivlDescr.appendChild(this.textDescr);
        var descr = document.getElementById('descr');
        this.update();
        var thisInterval = this;
        
        thisInterval.viz.addEventListener('mouseover',function(){
            thisInterval.ivlDescr.classList.add('hover');
        },false);
        thisInterval.viz.addEventListener('mouseleave',function(){
            thisInterval.ivlDescr.classList.remove('hover');
        },false);
        
        this.ivlDescr.addEventListener('mouseover',function(){
            thisInterval.viz.classList.add('hover');
        },false);
        this.ivlDescr.addEventListener('mouseleave',function(){
            thisInterval.viz.classList.remove('hover');
        },false);
        descr.appendChild(this.ivlDescr);
        this.textDescr.focus();
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

/**************************************
Track
**************************************/
class Track{
    constructor(title_){
        this.setTitle(title_);
        this.intervals = [];
        this.cnt = 0;
        var thistrack = this;
        document.addEventListener('checkIntersect',
        function(e){
                console.log('checkIntersect',e);
            var ivl = thistrack.intervals.filter(function(interval){
                return interval.index == e.index;
            })[0];
            if(ivl!=undefined){
            if(!thistrack.intersectAny(e.start_s,e.end_s,e.index)){
                var motionApprovedEvent = new CustomEvent('motionApproved');
                motionApprovedEvent.start_s = e.start_s;
                motionApprovedEvent.end_s = e.end_s;
                motionApprovedEvent.index = e.index;
                document.dispatchEvent(motionApprovedEvent);
            }else{
                alert("Элементы не должны пересекаться");
            }}
        },false);
    }
    setTitle(title_){
        while(title_ == undefined || title_ == ''){
            title_ = prompt("Введите название дорожки","Дорожка");
            if(title_ == undefined){
                break;
            }
        }
        this.title = title_;
    }
    intersect(interval,start_s,end_s){
        var A = (interval.start_s < start_s),
                B = (interval.end_s < end_s),
                C = (interval.start_s < end_s),
                D = (interval.end_s < start_s);
        if((A||B||C||D)&&(!A||!B||!C||!D))
        {
            console.log('пересекает');
            return true;
        }
        else{ 
            return false;
        }
    }
    intersectAny(start_s,end_s,index){
        var intersects = false;
        for(var i=0; i < this.intervals.length; i++){
            if(this.intervals[i].index != index){
            if(this.intersect(this.intervals[i], start_s, end_s)){   
                intersects = true;
                break;
            }}
        }
        return intersects;
    }
    moveInterval(index,newstart_s){
        var ivl = this.intervals[index];
        if(!intersectAny(newstart_s,ivl.duration_s(),index)){
            this.intervals[index].start_s = newstart_s;
            this.intervals[index].end_s = ivl.duration_s();
            console.log(this.intervals[index]);
        }else{
            console.log("Перескает!");
        }
    }
    addInterval(_interv){
        if(!this.intersectAny(_interv.start_s,_interv.end_s)){
            this.intervals.push(_interv);
            console.log(this.intervals);
            this.cnt++;
            return true;
        }else{
            alert("Элементы не должны пересекаться");
            return false;
        }
    }
    deleteInterval(interval){
        console.log("Удалить "+interval.index);
        for(var i = 0; i < this.intervals.length; i++){
            console.log(this.intervals[i].index);
            if(this.intervals[i].index == interval.index){
                this.intervals.splice(i,1);
                break;
            }
        }
    }
}


/**************************************
    Interview
**************************************/
class Interview{
    constructor(_title,_num){
        this.title = _title;
        this.num = _num;
        this.tracks = [];
    }
    addTrack(track){
        if(track.title != undefined && track.title != ""){
            this.tracks.push(track);
            return true;
        }else{
            return false;
        }
    }
}    

/**************************************
VizTrack
**************************************/
class VizTrack{
    constructor(parent,track){
        this.div = document.createElement('div');
        this.div.className = "Track";
        this.div.track = track; 
        var thistrack = this;
        parent.appendChild(this.div);
    }
    addInterval(e){
        console.log("VizTrack");
    }
    showDescription(){
        
    }
    static pix2sec(offset_px){ 
        let offset_s = parseFloat(offset_px) / parseFloat(zoom.value); 
        return offset_s;
    }
    static pc2sec(offset_pc){ 
        let offset_px = (offset_pc * timeline.clientWidth) / 100.0; 
        let offset_s = VizTrack.pix2sec(offset_px);
        return offset_s;
    }
}
class MenuIntervalControls{
    constructor(parentNode){
        var iControl = document.createElement('div');
        iControl.id='iControl';
        iControl.style.display='none';
        var counter = 0;
        var bMoveLeft = document.createElement('button');
        var inputMoveStep = document.createElement('input');
        var bMoveRight = document.createElement('button');
        bMoveLeft.innerText='<<';
        bMoveRight.innerText='>>';
        bMoveLeft.id='bMoveLeft';
        bMoveRight.id='bMoveRight';
        bMoveLeft.onclick = function(){
            var moveIntervalEvent =new CustomEvent('moveInterval');
            moveIntervalEvent.step_s = -parseFloat(inputMoveStep.value);
            console.log(moveIntervalEvent);
            document.dispatchEvent(moveIntervalEvent);
        }
        bMoveRight.onclick = function(){
            var moveIntervalEvent = new CustomEvent('moveInterval');
            moveIntervalEvent.step_s = parseFloat(inputMoveStep.value);
            console.log(moveIntervalEvent);
            document.dispatchEvent(moveIntervalEvent);
        }
        inputMoveStep.type='number';
        inputMoveStep.value = 1.0;
        inputMoveStep.max = 180.0;
        inputMoveStep.step = 0.1;
        inputMoveStep.min = 0.00;
        iControl.appendChild(bMoveLeft);
        iControl.appendChild(bMoveRight);
        iControl.appendChild(inputMoveStep);
        parentNode.appendChild(iControl);
        document.addEventListener('intervalChoosen',function(){counter++; iControl.style.display='block';},false);
        document.addEventListener('intervalUnchoosen',
            function(){
                counter--;
            if(counter == 0){
                iControl.style.display='none';
            }
        },false);
    }
}
/**************************************
 VizTrackMedia
**************************************/
class VizTrackMedia extends VizTrack{
    constructor(parent,track){
        super(parent,track);
        this.div.className = "TrackMedia";
        this.div.onclick = this.addInterval;
        this.radio = document.createElement('div');
        this.radio.className = 'trackChooserRadio';
        trackChooserPanelMedia.appendChild(this.radio);
    }
    addInterval(event){
            if(event.target.track != null){
                var fileinput = document.getElementById('fileInput');
                fileinput.viztrack=event.target;
                fileinput.onchange = function(e){
                    window.URL = window.URL || window.webkitURL;
                    var path = window.URL.createObjectURL(e.target.files[0]);
                    console.log(path);
                    var audio = new Audio(path);
                    audio.parentEvent = e;
                    audio.ondurationchange = function(ev){
                        console.log(audio.duration);
                        var ivl = new IntervalMedia(path,
                                                    VizTrack.pix2sec(event.offsetX),
                                                    VizTrack.pix2sec(event.offsetX)+audio.duration);
                        
                        if(event.target.track.addInterval(ivl)){
                            new VizIntervalMedia(event.target,ivl);
                        }
                    }
                    resetform.reset();
                };
                $("#fileInput").trigger("click");
            }else if(event.target.interval != null){
                if(event.target.choosen){
                    document.dispatchEvent(new CustomEvent('intervalUnchoosen',event.target));
                    event.target.classList.remove('choosen');
                    event.target.choosen = false;
                }else{
                    document.dispatchEvent(new CustomEvent('intervalChoosen',event.target));
                    event.target.classList.add('choosen');
                    event.target.choosen = true;
                }
                console.log('Нажат элемент медиа');
            }
    }

}

class ButtonPlayAndMark{
    constructor(parentNode){

        parentNode.appendChild(this.radio);
    }
}

/**************************************
VizTrackText
**************************************/
class VizTrackText extends VizTrack{
    constructor(parent,track){
        super(parent,track);
//        this.drag = false;
        var dragStart_pc =0;
        var dragEnd_pc =dragStart_pc;
        var selection = document.createElement('div');
        
        this.div.className = "TrackText";
        var thistrack = this;
//        var buttonPlay = new ButtonPlayAndMark(this.div);
        this.radio = document.createElement('input');
        this.radio.className = 'trackChooserRadio';
        this.radio.type = 'radio';
        this.radio.name = 'trackChooser';
        this.radio.realstate = false;
        this.radio.onclick = function(e){
            if(e.target.realstate){
                e.target.realstate = false;
                e.target.checked = false;
            }else{
                e.target.realstate = true;
                
            }
        };
        
        trackChooserPanelText.appendChild(this.radio);
        var ivl;
        document.addEventListener('startPlayAndMark',function(e){
            thistrack.radio.disabled = true;
            if(thistrack.radio.checked)
            {
                console.log(parseFloat(e.cursorPos_pc));
                var ivltext = new IntervalText(VizTrack.pc2sec(parseFloat(e.cursorPos_pc)),
                                               VizTrack.pc2sec(parseFloat(e.cursorPos_pc))+0.01);
                if(thistrack.div.track.addInterval(ivltext))
                {
                    ivl = new VizIntervalText(thistrack.div, ivltext);
                    ivl.viz.choosen = true;                    
                }
            }
        },false);
        document.addEventListener('cursorPlays',function(e){
            if(ivl!=undefined){
            if(thistrack.radio.checked && ivl.viz.choosen)
            {
                if(!thistrack.div.track.intersectAny(ivl.viz.interval.start_s,
                                                 VizTrack.pc2sec(parseFloat(e.cursorPos_pc)),
                                                 ivl.viz.interval.index)){
                    ivl.viz.interval.end_s = VizTrack.pc2sec(parseFloat(e.cursorPos_pc))-0.05;
                    ivl.update();
                }else{
                    var stopPlayingEvent = new CustomEvent('stopPlaying');
                    document.dispatchEvent(stopPlayingEvent);
                    console.log('Пересечение!');
                }
            }
            }
        },false);
        document.addEventListener('cantPlay',function(){
            thistrack.radio.disabled = false;
            if(ivl!=undefined && thistrack.radio.checked && ivl.viz.choosen){
                ivl.viz.choosen = false;
                ivl=undefined;
            }
        },false);
        document.addEventListener('stopPlayAndMark', function(event){
            thistrack.radio.disabled = false;
            if(ivl!=undefined && thistrack.radio.checked && ivl.viz.choosen){
                ivl.viz.choosen = false;
                ivl=undefined;
            }
        },false);
    }
    addInterval(event){
        if(event.target.track!=null){
            
                console.log('Нажата дорожка');
            }else if(event.target.interval != null){
                if(event.target.choosen){
                    document.dispatchEvent(new CustomEvent('intervalUnchoosen',{'detail':event.target}));
                    event.target.classList.remove('choosen');
                    event.target.choosen = false;
                    console.log('Отпущен текст');
                }else{
                    document.dispatchEvent(new CustomEvent('intervalChoosen',{'detail':event.target}));
                    event.target.classList.add('choosen');
                    event.target.choosen = true;
                    console.log('Нажат элемент текст');
                }
            }
    }
}


/**************************************
TrackMedia
**************************************/
class TrackMedia extends Track{
    constructor(title){
        super(title);
    }
}

/**************************************
 TrackText
**************************************/
class TrackText extends Track{
        constructor(title){
        super(title);
    }
}

class CursorPlay{
    constructor(timeline,zoom){
        this.prec = 5;
        this.timeline = timeline;
        this.zoom = zoom;
        this.div = document.createElement('div');
        this.div.className='cursor';
        this.div.id = 'cursorPlay';
        this.div.style.left = '0%';
        var thisCursor = this;
        this.time_s = 0;
        timeline.appendChild(this.div);
        
        var timerId;        
        document.addEventListener('startPlayAndMark',function(){
            var startPlayEvent = new CustomEvent('startPlay');
                document.dispatchEvent(startPlayEvent);
        },false);
        
        document.addEventListener('startPlay',function(){
                    const   prec=25;    
            timerId = setInterval(function() { 
                    thisCursor.div.scrollIntoView(false);

                    var cursorPlaysEvent = new CustomEvent('cursorPlays');
                    cursorPlaysEvent.cursorPos_s = thisCursor.time_s;
                    cursorPlaysEvent.cursorPos_pc = thisCursor.div.style.left;
                    document.dispatchEvent(cursorPlaysEvent);
                    thisCursor.time_s = thisCursor.time_s + 1.0/prec;
                }, 1000/prec);
        },false);
        var allowMove = true;
        
        document.addEventListener('startPlayAndMark',function(){
            allowMove = false;
        },false);
        document.addEventListener('stopPlayAndMark',function(){
            allowMove = true;
        },false);
        document.addEventListener('cantPlay',function(){
            allowMove = true;
        },false);
        
        timeline.onclick = function(e){
            if(allowMove){
                let x_px = e.clientX;            
                let scroll_px = wrapper.scrollLeft;
                let cursor = document.getElementsByClassName('cursor')[0];
                let offset_px = cursor.parentElement.offsetLeft;
                thisCursor.time_s = (x_px + scroll_px - offset_px - 1)/parseFloat(zoom.value); 
            }else{
                console.log('Низя двигать курсор во время маркировки');
            }
        }
        
        document.addEventListener('stopPlaying',function(e){
            clearInterval(timerId);
        },false);
        document.addEventListener('cantPlay',function(e){
            clearInterval(timerId);
        },false);
    }
    set time_s(val_s){
        if(val_s <= this.timeline.len_s){
            this.__time_s = Math.fround(val_s);
            this.update();
        }else{
            document.dispatchEvent(new CustomEvent('cantPlay'));
        }
    }
    get time_s(){
        return this.__time_s;
    }
    update(){
        this.div.style.left = this.time_s * this.zoom.value * 100.0 / this.timeline.clientWidth + '%';
    }
}
class Milestone{
    constructor(parentNode){
        Milestone.cnt = (Milestone.cnt || 0)+1;
        var time_s = Milestone.cnt;
        
        var milestone = document.createElement('div');        
        milestone.classList.add('milestone');
        if(time_s % 2 == 0) milestone.classList.add('milestone2');
        milestone.innerText = TimeDisplay.sec2str(time_s);
        parentNode.appendChild(milestone);
    }
}
class Timeline {
    constructor(parentNode,controlNode){
        var timeline = document.createElement('div');
        timeline.className = 'timeline';
        timeline.id = 'timeline';
        timeline.len_s = 3;
        
        
        this.timeline = timeline;
        for(var i = 0; i < timeline.len_s; i++){
            new Milestone(timeline);
        }
        document.addEventListener('intervalUpdated',function(e){
            var addition = 1;
            if(e.interval.type=='media'){
                addition = 3;
            }
//            console.log(e.interval);
            let end_s = parseInt(e.interval.end_s) + addition; // 3 is for safety
            if(end_s > timeline.len_s){
                let diff_s = end_s - timeline.len_s;
                timeline.len_s = end_s;
                for(var i = 0; i < diff_s; i++){
                    new Milestone(timeline);
                }
                document.dispatchEvent(new CustomEvent('timelineUpdated'));
            }
        },false);
        console.log(document.styleSheets[0]);
        var milestones = document.getElementsByClassName('milestone');
        for(var i = 0; i < milestones.length; i++){
            milestones[i].style.width = 50 + 'px';
        }
                    
        var zoom = document.createElement('input');
        this.zoom = zoom;
        zoom.id = 'zoom';
        zoom.type = 'range';
        zoom.min = 1;
        zoom.value = 50;
        zoom.step = 1;
        zoom.max = 100;
        zoom.onmousemove = zoom.onchange = function(e){
            var milestones = document.getElementsByClassName('milestone');
            for(var i = 0; i < milestones.length; i++){
                    milestones[i].style.width = e.target.value + 'px';
                }
            }
        
        controlNode.appendChild(zoom);
        parentNode.appendChild(timeline);
    }
    
}

class TimeDisplay{
    constructor(cursorParent,timeParent){
        
        var p = document.createElement('p');
        p.id = 'timeDisplay';
        p.this = this;
        p.innerHTML = '00:00:00.000';
        
        var cursor = document.createElement('div');
        cursor.className='cursor';
        window.addEventListener('mousemove',function (e) {
            let x_px = e.pageX;
            let scroll_px = wrapper.scrollLeft;
            let cursor = document.getElementsByClassName('cursor')[0];
            let offset_px = cursor.parentElement.offsetLeft;
            cursor.style.left = (x_px - offset_px - 1) + 'px';
            let s = (x_px + scroll_px - offset_px - 1)/parseFloat(zoom.value);
            timeDisplay.innerText = TimeDisplay.sec2str(s);
        },false);
        timeParent.appendChild(p);
        cursorParent.appendChild(cursor);
    }
    static sec2str(s){
        let str;
        let se = parseInt(s % 60);
            let ms = parseInt((s%60)*100)%100;
            let mi = parseInt(s / 60) % 60;
            let ho = parseInt(s / 360) % 24;
            str =  ho+':'+mi+':'+se+'.'+ms;
        return str;
    }
}

/**************************************
 VizInterview
**************************************/
class VizInterview{
    constructor(parent,interview){
        
        this.interview = interview;
        document.title = 'Интервью';
        
        var seq = document.createElement('div');
        seq.className = 'sequence';
        
        var trackChooserPanel = document.createElement('div');
        trackChooserPanel.id = 'trackChooserPanel';
        var trackChooserPanelText = document.createElement('div');
        trackChooserPanelText.id = 'trackChooserPanelText';
        var trackChooserPanelMedia = document.createElement('div');
        trackChooserPanelMedia.id = 'trackChooserPanelMedia';
        
        var wrapperCursor = document.createElement('div');
        wrapperCursor.className='wrapperCursor';
        wrapperCursor.id='wrapperCursor';
        
        var wrapper = document.createElement('div');
        wrapper.className = 'wrapper';
        wrapper.id = 'wrapper';
        var controls = document.createElement('div');
        controls.className = 'controls';
        controls.id = 'controls';
        var descr = document.createElement('div');
        descr.id='descr';
        var panelMedia = document.createElement('div');
        panelMedia.className='panelMedia';
        var panelText = document.createElement('div');
        panelText.className='panelText';
        this.butAddTrackMedia = document.createElement('button');
        this.butAddTrackMedia.interview = interview;
        this.butAddTrackMedia.onclick = function(){
            var t = new TrackMedia();
            if(this.interview.addTrack(t)){
                new VizTrackMedia(panelMedia,t);
            }
        };
        this.butAddTrackMedia.innerText = 'Добавить аудио-дорожку';
        this.butAddTrackMedia.title = 'Нажмите, чтобы добавить аудио';

        controls.appendChild(this.butAddTrackMedia); 
        this.butAddTrackText = document.createElement('button');
        this.butAddTrackText.interview = interview;
        this.butAddTrackText.onclick = function(){
            var t = new TrackText();
            if(this.interview.addTrack(t)){
                new VizTrackText(panelText,t);
            }
        };
        this.butAddTrackText.innerText = 'Добавить текстовую дорожку';
        
        var buttonPlay = document.createElement('button');
        var buttonPlayAndMark = document.createElement('button');
        buttonPlay.innerText = '▶';
        buttonPlay.id = 'buttonPlay';
        
        buttonPlayAndMark.innerText='M▶';
        buttonPlayAndMark.id = 'buttonPlayAndMark';
        
        buttonPlay.onclick = function(e){
            if(buttonPlay.innerText=='||'){        
                buttonPlay.innerText='▶';
                
                var eventStop = new CustomEvent('stopPlaying');
                document.dispatchEvent(eventStop);
            }
            else{
                buttonPlay.innerText='||';
                var startPlayEvent = new CustomEvent('startPlay');
                document.dispatchEvent(startPlayEvent);
            }
        };

        document.addEventListener('cantPlay',function(){
            buttonPlay.innerText = '▶';
            buttonPlayAndMark.innerText='M▶';
        },false);
        buttonPlayAndMark.onclick = function(e){
            if(buttonPlay.innerText=='||'){        
                buttonPlay.innerText='▶';
                buttonPlayAndMark.innerText = 'M▶';
                var stopPlayAndMarkEvent = new CustomEvent('stopPlayAndMark');
                document.dispatchEvent(stopPlayAndMarkEvent);
            }
            else{
                if(cp.time_s < timeline.timeline.len_s - 0.05){
                buttonPlay.innerText='||';
                buttonPlayAndMark.innerText = 'M||';
                    var startPlayAndMarkEvent = new CustomEvent('startPlayAndMark');
                    startPlayAndMarkEvent.cursorPos_pc = cursorPlay.style.left;
                    document.dispatchEvent(startPlayAndMarkEvent);
                }
            }
        };
        document.addEventListener('stopPlayAndMark',function(e){
                var stopPlayingEvent = new CustomEvent('stopPlaying');
                document.dispatchEvent(stopPlayingEvent);
        },false);
        
        controls.appendChild(this.butAddTrackText);
        controls.appendChild(buttonPlay);
        controls.appendChild(buttonPlayAndMark);
        var timeline = new Timeline(seq,controls);
        var cp = new CursorPlay(timeline.timeline,timeline.zoom);
        var bigwrapper = document.createElement('div');
        bigwrapper.id = 'bigwrapper';
        seq.appendChild(panelMedia);
        seq.appendChild(panelText); 
        new MenuIntervalControls(controls);
        wrapper.appendChild(seq);
        let timeDisplay = new TimeDisplay(wrapperCursor,controls) 
        wrapperCursor.appendChild(wrapper);
        trackChooserPanel.appendChild(trackChooserPanelMedia);
        trackChooserPanel.appendChild(trackChooserPanelText);
        bigwrapper.appendChild(trackChooserPanel);
        bigwrapper.appendChild(wrapperCursor);
        parent.appendChild(controls);
        parent.appendChild(bigwrapper);
        parent.appendChild(descr);
    }
}

/**************************************
 Исполнение скриптов
**************************************/
console.log('1');
body.interview = new Interview("int",1);
console.log('1');
body.VizInterview = new VizInterview(body,body.interview);