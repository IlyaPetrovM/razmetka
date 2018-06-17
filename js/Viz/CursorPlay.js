//import Subscriber
export default class CursorPlay{
    constructor(timeline, timeDisplay){
        this.prec = 5;
        this.timeline = timeline;
        var __timeDisplay = timeDisplay; 
        this.zoom = timeline.zoom;
        this.div = document.createElement('div');
        this.div.className='cursor';
        this.div.id = 'cursorPlay';
        this.div.style.left = '0%';
        var thisCursor = this;
        this.time_s = 0;
        this.div.this = this;
        this.timeline.div.appendChild(this.div);
        this.getPosS = function(){
            return this.time_s;
        }
        var __playingFragments = {};
        this.pushPlayingFragment = function(frg){
            __playingFragments[frg.getId()] = frg;
            console.log(__playingFragments);
        }
        this.removePlayingFragment = function(frg){
             delete __playingFragments[frg.getId()];
            console.log(__playingFragments);
        }
        this.getPlyingFragment = function(){
            let frg, maxEndFrg = undefined;
            for(let i in __playingFragments){
                if(maxEndFrg === undefined) maxEndFrg = i;
                if( __playingFragments[i].getEndS() > __playingFragments[maxEndFrg].getEndS() ){
                    maxEndFrg = i;
                }
            }
            console.log(__playingFragments[maxEndFrg]);
            return __playingFragments[maxEndFrg];
        }
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
                console.warn('Низя двигать курсор во время маркировки');
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
