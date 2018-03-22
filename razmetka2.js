/******************

    source: https://github.com/IlyaPetrovM/razmetka

********************/

"use strict";

var body = document.getElementsByTagName("body")[0];
const Act = new exports.Act();
import IDbTable from './IDbTable.js';
import IntervalMedia from "./IntervalMedia.js";
import IntervalText from './IntervalText.js';    

/**************************************
 Viz Interval
**************************************/
class VizInterval {
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
/**************************************
 Viz Interval Media
**************************************/
class VizIntervalMedia extends VizInterval {
    constructor(parent,data){
        super(parent,data);
        
        document.addEventListener('moveIntervalMediaEvent',this.move.bind(this));
        document.addEventListener('cursorChangePos', this.reactOnCursor.bind(this)); 
        document.addEventListener('motionApprovedMedia',this.move.bind(this));
    }
    
    reactOnCursor(cursorChangePosEvent) {
        let abs_s = cursorChangePosEvent.time_s;
        let rel_s = abs_s - this.viz.interval.start_s;
        if(rel_s > 0 && rel_s < this.viz.interval.audio.duration){
            this.viz.interval.cursorOn = true;
            this.viz.interval.audio.currentTime = rel_s;
        }else{
            this.viz.interval.cursorOn = false;
            this.viz.interval.audio.currentTime = 0;
        }
    }

    move(event) {
        if(this.viz.choosen){
            this.moveTextIntervals(event.step_s);
            this.viz.interval.move(event.step_s);
            this.update();
        }
    }
    
    moveTextIntervals(step_s){
        for(let i=0; i<this.viz.interval.textIntervals.length; i++){
            this.viz.interval.textIntervals[i].viz.interval.move(step_s);
        }
    }
    
    startPlay(){
        super.startPlay();
        this.viz.interval.cursorOn = true;
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

/**************************************
Track
**************************************/
class Track{
    constructor(title_){
        this.title = title_;
        this.intervals = [];
        this.cnt = 0;
        var thistrack = this;
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
            let leftIvl = this.findLeft(_interv);
            if(leftIvl!=undefined){ // ссылки на соседей
                _interv.leftInterval = leftIvl;
                _interv.rightInterval =  leftIvl.rightInterval;
                leftIvl.rightInterval = _interv;
                console.log(_interv);
            }
            this.intervals.push(_interv);
            this.cnt++;
            return true;
        }else{
            alert("Элементы не должны пересекаться");
            return false;
        }
    }
    findLeft(ivl){
        if(this.intervals.length>0){
            let max_i = 0;
            for(let i=0; i < this.intervals.length; i++){
                if(this.intervals[i].end_s > this.intervals[max_i].end_s && 
                  this.intervals[i].end_s < ivl.end_s)
                    {
                        max_i = i;
                    }
            }
            return this.intervals[max_i];
        }else{
            return undefined;
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
class Interview extends IDbTable{
    constructor(_id, _title, _date, wsClient){
        super();
        this.title = _title;
        this.id = _id;
        this._date = _date;
        this.tracks = [];
//        this.wsClient = wsClient;
//        this.wsClient.addEventListener('message',this.processMessageFromServer.bind(this));
    }
    get name(){
        return "Interview";
    }
    insert(){
//        this.wsClient.send('insert Interview values ('+ this.title +')');
    }
    select(id){
        
    }
    update(id){
        
    }
    remove(id){
        
    }
    remove(inMsg){
            console.log(inMsg);
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
class InterviewChooser{
    constructor(wsocket,parentNode){
        this.wsClient = wsocket;
        this.wsClient.addEventListener('message',this.processMessageFromServer.bind(this));
        this.div = document.createElement('div');
        this.div.id = 'interviewChooser';
        this.buttonAdd = document.createElement('button');
        this.buttonAdd.innerHTML = 'Добавить интервью';
        this.buttonAdd.id = 'createInterviewButton';
        this.buttonAdd.addEventListener('click',this.createInterview.bind(this));
        this.div.appendChild(this.buttonAdd);
        this.interviews = {};
        this.interviewItems = {};
        
        this.editGroupButtons = document.createElement('div');
        this.editGroupButtons.id = 'editGroupButtons';
        this.targetItem = undefined;
        this.buttonEdit = document.createElement('button');
        this.buttonDel = document.createElement('button');
        this.buttonEdit.title = "Редактировать";
        this.buttonDel.title = "Удалить";
        this.buttonEdit.innerHTML = "&#9998;";
        this.buttonDel.innerHTML = "&#10006;";
        this.buttonEdit.className = "buttonEdit";
        this.buttonDel.className = 'buttonDel';
        this.buttonEdit.onclick = this.update.bind(this);
        this.buttonDel.onclick = this.remove.bind(this); // Чтобы передавать как параметр только один выбранный элемент
        
        this.editGroupButtons.appendChild(this.buttonEdit);
        this.editGroupButtons.appendChild(this.buttonDel);
         this.div.appendChild(this.editGroupButtons);
        parentNode.appendChild(this.div);
        this.wsClient.onopen = this.select.bind(this);
        
    }
    get table(){
        return "Interview";
    }
    get sender(){
        return "InterviewChooser";
    } 
    createInterview(){
        let title_ = '', date_ = new Date('1992-01-13');
        let send = true;
        while(title_ === null || title_ === ''){
            title_ = prompt("Введите название интервью","Интервью 1");
            if(title_ === null){
                send = false;
                break;
            }
        }
        if(send){
            this.wsClient.send(JSON.stringify({
                action: Act.CREATE,
                sender:this.sender,
                table:this.table,
                title:title_,
                _date:date_
            }));
        }
//        this.createLink(title_);
//        var inter = new Interview(title_,date_,this.wsClient);
//        inter.insert();
//       this.interviews.push(inter);
    }
    select(){
//        if(this.wsClient.state !== 'CONNECTING'){
            let outMsg = JSON.stringify({
                action: Act.LOAD,
                table:  this.table,
                sender: this.sender
            });
            this.wsClient.send(outMsg);
            console.log(outMsg);
//        }
    }
    processMessageFromServer(inMsg){
        let msg = JSON.parse(inMsg.data);
        console.log(msg);
        
            switch(msg.action){
                case Act.ERROR:
                    alert('Данные отправленные в базу данных не были сохранены. Попробуйте ещё раз.');
                    break;
                case Act.CREATE:
                    this.createLink(msg);
                    console.log('CREATE');
                    break;
                case Act.UPDATE:
                    this.processUpdate(msg);
                    console.log('UPDATE');
                    break;
                case Act.LOAD:
                    if(msg.sender === this.sender){
                        for(let i in msg.result){
                            this.createLink(msg.result[i]);
                        }
                    }
                    break;
                case Act.DELETE:
                    this.deleteLink(msg.id);
                    console.log('DELETE');
                    break;
                default:
                    console.log('Неизвестная команда:',msg.action);
            
        }
    }
    
    deleteLink(id){
        this.div.removeChild(this.interviewItems[id]);
    }
    openInterview(id){
        
    }
    closeInterview(id){
        
    }
    
    updateLink(inte, a) {
        let d = new Date(inte._date);
        let month = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(d.getMonth()+1);
        let day = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(d.getDate());
        a.innerHTML =`${inte.id} ${d.getFullYear()}-${month}-${day} ${inte.title}`;
        a.onmouseover = this.drawControl.bind(this,a);
    }

    createLink(inte){
        var a = document.createElement('a');
        a.className = 'interviewLink';
        a.href = '#';
        console.log(inte);
        
        
        a._id = inte.id;
        this.interviews[inte.id] = new Interview(inte.id, inte.title, inte._date, this.wsClient);
        this.interviewItems[inte.id] = a;
        this.updateLink(inte, this.interviewItems[inte.id]);
        this.div.appendChild(a);
    }
    
    drawControl(targetItem,e){
        let rect = targetItem.getBoundingClientRect();
        this.editGroupButtons.style.top = rect.y + 'px';
        this.targetItem = targetItem;
    }
    
    update(onClickEvent){
        let msg_obj = {
            action: Act.UPDATE,
            table: this.table,
            sender: this.sender,
            id:this.targetItem._id,
            data:{}
        };
        for(let key in this.interviews[this.targetItem._id]){
            if(key !== 'id' && key !== 'tracks'){
                let val = prompt(`${key}`, this.interviews[this.targetItem._id][key]);
                if(val){
                        msg_obj.data[key] = val; 
                }
            }
        }
        let outMsg = JSON.stringify(msg_obj);
        this.wsClient.send(outMsg);
        console.log(outMsg);
    }
    
    processUpdate(msg){
        for(let key in this.interviews[msg.id]){
            if(msg.data[key]){
                this.interviews[msg.id][key] = msg.data[key];
            }
        }
        this.updateLink(this.interviews[msg.id], this.interviewItems[msg.id]);
    }
    
    remove(_id,onClickEvent){
        console.log(_id);
        let res = confirm('Вы уверены, что хотите удалить интервью?');
        if(res){
           let outMsg = JSON.stringify({
                action:Act.DELETE,
                id:this.targetItem._id,
               table:this.table,
               sender:this.sender
           });     
           this.wsClient.send(outMsg);
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
                
        this.radio = document.createElement('input');
        this.radio.type = 'radio';
        this.radio.className = 'trackChooserRadio';
        this.radio.realstate = false;
        this.radio.onclick = function(e){
            if(e.target.realstate){
                e.target.realstate = false;
                e.target.checked = false;
            }else{
                e.target.realstate = true;
                
            }
        };

        parent.appendChild(this.div);
    }
    addInterval(e){
        console.log("VizTrack");
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
        this.iControl = document.createElement('div');
        this.iControl.id = 'iControl';
        this.iControl.style.display='none';
        this.counter = 0;
        var bMoveLeft = document.createElement('button');
        var bMoveRight = document.createElement('button');
        
        bMoveLeft.innerText = '<<';
        bMoveRight.innerText = '>>';
        bMoveLeft.id = 'bMoveLeft';
        bMoveRight.id = 'bMoveRight';
        
        var inputMoveStep = document.createElement('input');
        inputMoveStep.id = 'inputMoveStep';
        inputMoveStep.type='number';
        inputMoveStep.value = 1.0;
        inputMoveStep.max = 180.0;
        inputMoveStep.step = 0.1;
        inputMoveStep.min = 0.00;
        this.iControl.appendChild(bMoveLeft);
        this.iControl.appendChild(bMoveRight);
        this.iControl.appendChild(inputMoveStep);
        parentNode.appendChild(this.iControl);
        
        
        bMoveLeft.onclick = this.sendStepToMove.bind( this,  false);
        bMoveRight.onclick = this.sendStepToMove.bind( this, true );
        document.addEventListener( 'intervalChoosen', this.showMotionControl.bind(this,true) );
        document.addEventListener( 'intervalUnchoosen', this.showMotionControl.bind(this,false) );
    }
    
     showMotionControl(show) {
        if(show){
            this.counter++; 
            this.iControl.style.display = 'block';
        }else{
            this.counter--;
            if(this.counter == 0){
                this.iControl.style.display = 'none';
            }
        }
    }
    
    sendStepToMove(right) {
        let step_s = -parseFloat(inputMoveStep.value);
        if(right){
            step_s = parseFloat(inputMoveStep.value)
        }
        var moveIntervalEvent = new CustomEvent('moveIntervalMediaEvent');
        moveIntervalEvent.step_s = parseFloat(step_s);
        console.log(moveIntervalEvent);
        document.dispatchEvent(moveIntervalEvent);
    }
}
/**************************************
 VizTrackMedia
**************************************/
class VizTrackMedia extends VizTrack{
    
    constructor(parent, track){
        super(parent, track);
        this.div.className = "TrackMedia";
        this.div.addEventListener('click',this.processClick.bind(this));

        this.radio.name = 'trackChooserMedia';
        trackChooserPanelMedia.appendChild(this.radio);
        document.addEventListener('getMediaIntervalEvent',this.getMediaInterval.bind(this));
    }
    
    getMediaInterval(getMediaIntervalEvent) {
        if(this.radio.checked){
            let intervals = this.div.track.intervals.filter( 
                function(ivl){
                    return ivl.cursorOn === true;
                } 
            );
            if(intervals[0] != undefined){
                getMediaIntervalEvent.trackText.connect(intervals[0]);
            }
        }
    }

    createInterval(path, audio, clickEvent) { // event appends to the enduuu
        var ivl = new IntervalMedia( path,
                                    VizTrack.pix2sec(clickEvent.offsetX),
                                    VizTrack.pix2sec(clickEvent.offsetX) + audio.duration );
        if( this.div.track.addInterval(ivl) ){
            new VizIntervalMedia(clickEvent.target, ivl);
        }
    }

    processClick(clickEvent){
            if(clickEvent.target.track != null){
                fileInput.viztrack = clickEvent.target;
                fileInput.onchange = function(e){
                    window.URL = window.URL || window.webkitURL;
                    var path = window.URL.createObjectURL(e.target.files[0]);
                    var audio = new Audio(path);
                    audio.parentEvent = e;
                    audio.ondurationchange = 
                        this.createInterval.bind(this, path, audio, clickEvent); // and Event in the end
                    resetform.reset();
                }.bind(this);
                $("#fileInput").trigger("click");
            }else if(clickEvent.target.interval != null){
                if(clickEvent.target.choosen){
                    document.dispatchEvent(new CustomEvent('intervalUnchoosen', clickEvent.target));
                    clickEvent.target.classList.remove('choosen');
                    clickEvent.target.choosen = false;
                }else{
                    document.dispatchEvent(new CustomEvent('intervalChoosen',clickEvent.target));
                    clickEvent.target.classList.add('choosen');
                    clickEvent.target.choosen = true;
                }
                console.log('Нажат элемент медиа');
            }
    }
} /// class end

/**************************************
VizTrackText
**************************************/
class VizTrackText extends VizTrack{
    constructor(parent,track){
        super(parent,track);
        this.div.className = "TrackText";
                
        var dragStart_pc = 0;
        var dragEnd_pc = dragStart_pc;
        
        var selection = document.createElement('div');

        this.radio.name = 'trackChooserText';
        trackChooserPanelText.appendChild(this.radio);
        
        this.ivl = null;
        
        document.addEventListener('startPlayAndMark',function(e){
            this.radio.disabled = true;
            if(this.radio.checked)
            {
                console.log(parseFloat(e.cursorPos_pc));
                let getMediaIntervalEvent = new CustomEvent('getMediaIntervalEvent');
                getMediaIntervalEvent.trackText = this;
                document.dispatchEvent(getMediaIntervalEvent);
            }
        }.bind(this));
        
        document.addEventListener('cursorPlays',function(e){
            if(this.ivl != undefined){
                if(this.radio.checked && this.ivl.viz.choosen)
                {
                    if( !this.div.track.intersectAny(this.ivl.viz.interval.start_s,
                                                     VizTrack.pc2sec( parseFloat(e.cursorPos_pc) ),
                                                     this.ivl.viz.interval.index) ){
                        this.ivl.viz.interval.end_s = VizTrack.pc2sec( parseFloat(e.cursorPos_pc) )-0.05;
                        this.ivl.update();
                    }else{
                        var stopPlayingEvent = new CustomEvent('stopPlaying');
                        document.dispatchEvent(stopPlayingEvent);
                        console.log('Пересечение!');
                    }
                }
            }
        }.bind(this));
        
        document.addEventListener('cantPlay',function(){
            this.radio.disabled = false;
            if(this.ivl != undefined && this.radio.checked && this.ivl.viz.choosen){
                this.ivl.viz.choosen = false;
                this.ivl = undefined;
            }
        }.bind(this));
        
        document.addEventListener('stopPlayAndMark', function(event){
            this.radio.disabled = false;
            if(this.ivl!=undefined && this.radio.checked && this.ivl.viz.choosen){
                this.ivl.viz.choosen = false;
                this.ivl=undefined;
            }
        }.bind(this));
    }
    
    connect(intervalMedia){
        var ivltext = new IntervalText(cursorPlay.this.time_s,
                                       cursorPlay.this.time_s+0.01);
        if(this.div.track.addInterval(ivltext))
        {
            console.log(intervalMedia);
            this.ivl = new VizIntervalText(this.div, ivltext, intervalMedia);
            this.ivl.viz.choosen = true;                    
        }
    }
    addInterval(event){
        if(event.target.track!=null){
            console.log('Нажата дорожка');
        }else {
            if(event.target.interval != null){
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
}


/**************************************
TrackMedia
**************************************/
class TrackMedia extends Track{
    constructor(title){
        super(title);
        var thistrack=this;
        document.addEventListener('checkIntersect',
        function(e){
                console.log('checkIntersect',e);
            var ivl = thistrack.intervals.filter(function(interval){
                return interval.index == e.index;
            })[0];
            if(ivl!=undefined){
            if(!thistrack.intersectAny(e.start_s,e.end_s,e.index)){
                var motionApprovedMediaEvent = new CustomEvent('motionApprovedMedia');
                motionApprovedMediaEvent.start_s = e.start_s;
                motionApprovedMediaEvent.end_s = e.end_s;
                motionApprovedMediaEvent.index = e.index;
                motionApprovedMediaEvent.step_s = e.step_s;
                document.dispatchEvent(motionApprovedMediaEvent);
            }else{
                alert("Элементы не должны пересекаться");
            }}
        });
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
    constructor(timeline){
        this.prec = 5;
        this.timeline = timeline;
        this.zoom = timeline.zoom;
        this.div = document.createElement('div');
        this.div.className='cursor';
        this.div.id = 'cursorPlay';
        this.div.style.left = '0%';
        var thisCursor = this;
        this.time_s = 0;
        this.div.this = this;
        this.timeline.div.appendChild(this.div);
        
        var timerId;        
        document.addEventListener('startPlayAndMark',function(){
            var startPlayEvent = new CustomEvent('startPlay');
                document.dispatchEvent(startPlayEvent);
        });
        
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
        });
        var allowMove = true;
        
        document.addEventListener('startPlayAndMark',function(){
            allowMove = false;
        });
        document.addEventListener('stopPlayAndMark',function(){
            allowMove = true;
        });
        document.addEventListener('cantPlay',function(){
            allowMove = true;
        });
        
        document.addEventListener('cursorChangePos',function(e){
            if(allowMove){
                thisCursor.time_s = e.time_s;
            }else{
                console.log('Низя двигать курсор во время маркировки');
            }
        });
        
        document.addEventListener('timelineUpdated',function(){
            thisCursor.update();
        });
        
        document.addEventListener('stopPlaying',function(e){
            clearInterval(timerId);
        });
        document.addEventListener('cantPlay',function(e){
            clearInterval(timerId);
        });
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
        this.div.style.left = this.time_s * this.zoom.value * 100.0 / this.timeline.div.clientWidth + '%';
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

        document.addEventListener('intervalUpdated',function(e){
            var addition = 1;
            if(e.interval.type == 'media'){
                addition = 3;
            }
            let end_s = parseInt(e.interval.end_s) + addition; // 3 is for safety
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
    static sec2str(val_s){
        let str;
        let s = 0;
        if(val_s > 0) s = val_s;
//        let fmt = ;
        let se = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(parseInt(s % 60));
            let ms = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:3}).format(parseInt((s%60)*1000)%1000);
            let mi = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(parseInt(s / 60) % 60);
            let ho = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(parseInt(s / 360) % 24);
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
                    body.interview.insert();
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
                console.log(timeline);
                if(cp.time_s < timeline.len_s - 0.05){
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
        var cp = new CursorPlay(timeline);
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
var wsClient = new WebSocket('ws://localhost:8081');
//body.interview = new Interview("New Interview!",webSock);

//body.VizInterview = new VizInterview(body,body.interview);

var ic = new InterviewChooser(wsClient,body);