import VizTrack from './VizTrack.js';
import VizIntervalText from './VizIntervalText.js';
import IntervalText from './IntervalText.js';
/**************************************
VizTrackText
**************************************/
export default class VizTrackText extends VizTrack{
    constructor(parent,track){
        super(parent,track);
        this.div.className = "TrackText";
                
        var dragStart_pc = 0;
        var dragEnd_pc = dragStart_pc;
        
        var selection = document.createElement('div');

        this.radio.name = 'trackChooserText';
        trackChooserPanelText.appendChild(this.radio);
        
        this.ivl = null;
        console.log(this);
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
