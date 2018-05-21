import VizTrack from './VizTrack.js';
import VizIntervalMedia from './VizIntervalMedia.js';
import IntervalMedia from '../IntervalMedia.js';
/**************************************
 VizTrackMedia
**************************************/
export default class VizTrackMedia extends VizTrack{
    
    constructor(parent, track,parentPanel){
        super(parent, track,parentPanel);
        this.div.className = "TrackMedia";
        this.div.addEventListener('click',this.processClick.bind(this));

        this.radio.name = 'trackChooserMedia';
        this.panel.classList.add('trackCPanelMedia');
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
