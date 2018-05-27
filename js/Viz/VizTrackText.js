import VizTrack from './VizTrack.js';
import VizFragmentText from './VizFragmentText.js';
import FragmentText from '../FragmentText.js';
/**************************************
VizTrackText
**************************************/
export default class VizTrackText extends VizTrack{
    constructor(parent,track,parentPanel){
        super(parent,track,parentPanel);
        this.div.className = "TrackText";
        var __div = this.div;
        var dragStart_pc = 0;
        var dragEnd_pc = dragStart_pc;
        var __vizFragments = {};
        var selection = document.createElement('div');

        this.radio.name = 'trackChooserText';
        this.panel.classList.add('trackCPanelText');

        this.onUpdate = function(track){
//            super.onUpdate(track);
            let frg;
            for(let i in track.getFragments()){
                frg = track.getFragments()[i];
                __vizFragments[frg.getId()] = new VizFragmentText(__div,frg, undefined);
            };
        }
        this.ivl = null;
        console.log(this);
        document.addEventListener('startPlayAndMark',function(e){
            this.radio.disabled = true;
            if(this.radio.checked)
            {
                console.log(parseFloat(e.cursorPos_pc));
                let getMediaFragmentEvent = new CustomEvent('getMediaFragmentEvent');
                getMediaFragmentEvent.trackText = this;
                document.dispatchEvent(getMediaFragmentEvent);
            }
        }.bind(this));
        
        document.addEventListener('cursorPlays',function(e){
            if(this.ivl != undefined){
                if(this.radio.checked && this.ivl.viz.choosen)
                {
                    if( !this.div.track.intersectAny(this.ivl.viz.fragment.start_s,
                                                     VizTrack.pc2sec( parseFloat(e.cursorPos_pc) ),
                                                     this.ivl.viz.fragment.index) ){
                        this.ivl.viz.fragment.end_s = VizTrack.pc2sec( parseFloat(e.cursorPos_pc) )-0.05;
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
    
    connect(fragmentMedia){
        var ivltext = new FragmentText(cursorPlay.this.time_s,
                                       cursorPlay.this.time_s+0.01);
        if(this.div.track.addFragment(ivltext))
        {
            console.log(fragmentMedia);
            this.ivl = new VizFragmentText(this.div, ivltext, fragmentMedia);
            this.ivl.viz.choosen = true;                    
        }
    }
    addFragment(event){
        if(event.target.track!=null){
            console.log('Нажата дорожка');
        }else {
            if(event.target.fragment != null){
                if(event.target.choosen){
                    document.dispatchEvent(new CustomEvent('fragmentUnchoosen',{'detail':event.target}));
                    event.target.classList.remove('choosen');
                    event.target.choosen = false;
                    console.log('Отпущен текст');
                }else{
                    document.dispatchEvent(new CustomEvent('fragmentChoosen',{'detail':event.target}));
                    event.target.classList.add('choosen');
                    event.target.choosen = true;
                    console.log('Нажат элемент текст');
                }
            }
        }
    }
}
