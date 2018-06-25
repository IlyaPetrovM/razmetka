import VizTrack from './VizTrack.js';
import VizFragmentText from './VizFragmentText.js';
import FragmentText from '../FragmentText.js';
import CursorPlay from './CursorPlay.js';
import DescriptionBar from './DescriptionBar.js';
/**************************************
VizTrackText
**************************************/
export default class VizTrackText extends VizTrack{
    constructor(parent,track,parentPanel,timeline,parentDescr, cursorPlay){
        if(!(cursorPlay instanceof CursorPlay)) throw TypeError('CursorPlay is undefined');
        super(parent,track,parentPanel);
        this.div.className = "TrackText";
        var __div = this.div;
        var __cursorPlay = cursorPlay;
        var __trackDiscr = document.createElement('div');
        var __wrapper = document.createElement('div');
        
        __trackDiscr.className = 'trackDiscr';
        
        var dragStart_pc = 0;
        var dragEnd_pc = dragStart_pc;
        var __vizFragments = {};
        var __descriptionBars = {};
        var selection = document.createElement('div');
        var __lastAddedFragment;
        var addFragmentTextButton = document.createElement('button');
        addFragmentTextButton.id = 'addFragmentTextButton';
        addFragmentTextButton.innerText = '+';
        var bAddFragment = false;

        addFragmentTextButton.onclick = function(e){
            let start_s = __cursorPlay.getPosS();
            let end_s = start_s + 2;
            if(bAddFragment) {__lastAddedFragment.setEndS(start_s-0.1);}
            let media = __cursorPlay.getPlyingFragment(); //FIXME media определяется почему-то неправильно
            if(media === undefined){
                alert('Невозможно добавить описание, так как не ясно, что вы описываете. Переместите Красный курсор на какую-нибудь аудиозапись');
                console.warn('nothing to describe');
                return;
            }
            track.addFragment(start_s,end_s,'',media.getId() );
            bAddFragment = true;
        }.bind(this);
        document.addEventListener('stopPlaying',function(){
            if(bAddFragment){
                __lastAddedFragment.setEndS(__cursorPlay.getPosS());
                bAddFragment = false;
            }
        }.bind(this),false)
        __wrapper.appendChild(__trackDiscr);
        __wrapper.appendChild(addFragmentTextButton);
        parentDescr.appendChild(__wrapper);
        this.radio.name = 'trackChooserText';
        this.panel.classList.add('trackCPanelText');

        this.onUpdate = function(track){
            let frg;
            for(let i in track.getFragments()){
                
                frg = track.getFragments()[i];
                let id = frg.getId();
                if( __vizFragments[id] === undefined){
                    __vizFragments[id] = new VizFragmentText(__div,
                                                                      frg,
                                                                      undefined,
                                                                      timeline,
                                                                      __trackDiscr);
                    __descriptionBars[id] = new DescriptionBar(__trackDiscr,
                                                                     frg,
                                                                     __vizFragments[id]);
                    __vizFragments[id].setDescriptionBar(__descriptionBars[id]);
                    frg.addSubscriber(__vizFragments[id]);
                    frg.addSubscriber(__descriptionBars[id]);
                    frg.update(frg);
                    __lastAddedFragment = frg;
                }
            }
        }
        this.ivl = null;
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
//        var ivltext = new FragmentText(cursorPlay.this.time_s, // DEPRECATED
//                                       cursorPlay.this.time_s+0.01);
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
