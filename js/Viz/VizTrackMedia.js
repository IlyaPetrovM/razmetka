import VizTrack from './VizTrack.js';
import VizFragmentMedia from './VizFragmentMedia.js';
import FragmentMedia from '../FragmentMedia.js';
/**************************************
 VizTrackMedia
**************************************/
export default class VizTrackMedia extends VizTrack{
    constructor(parent, track, parentPanel,timeline){
        super(parent, track,parentPanel);
        
        var __track = track;
        this.div.className = "TrackMedia";
        this.div.addEventListener('click',this.processClick.bind(this));
        var __div = this.div;
        var __vizFragments = {};
        this.radio.name = 'trackChooserMedia';
        this.panel.classList.add('trackCPanelMedia');
//        document.addEventListener('getMediaFragmentEvent',this.getMediaFragment.bind(this));
        
        this.onUpdate = function(track){
            let frg;
            for(let i in track.getFragments()){
                frg = track.getFragments()[i];
                __vizFragments[frg.getId()] = new VizFragmentMedia(__div, frg);
                frg.addSubscriber(__vizFragments[frg.getId()]);
                frg.addSubscriber(timeline);
                frg.update(frg);
            }
        }
        __track.loadFragments();

        this.createFragment = function(path, audio, clickEvent) { // event appends to the enduuu
            __track.addFragment(path,
                                VizTrack.pix2sec(clickEvent.offsetX),
                                VizTrack.pix2sec(clickEvent.offsetX) + audio.duration);
            console.log(__track);
        }
    }
    
    getMediaFragment(getMediaFragmentEvent) {
        if(this.radio.checked){
            let fragments = this.div.track.fragments.filter( 
                function(ivl){
                    return ivl.cursorOn === true;
                } 
            );
            if(fragments[0] != undefined){
                getMediaFragmentEvent.trackText.connect(fragments[0]);
            }
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
                        this.createFragment.bind(this, path, audio, clickEvent); // and Event in the end
                    resetform.reset();
                }.bind(this);
                $("#fileInput").trigger("click");
            }else if(clickEvent.target.fragment != null){
//                if(clickEvent.target.choosen){
//                    document.dispatchEvent(new CustomEvent('fragmentUnchoosen', clickEvent.target));
//                    clickEvent.target.classList.remove('choosen');
//                    clickEvent.target.choosen = false;
//                }else{
//                    document.dispatchEvent(new CustomEvent('fragmentChoosen',clickEvent.target));
//                    clickEvent.target.classList.add('choosen');
//                    clickEvent.target.choosen = true;
//                }
                console.log('Нажат элемент медиа');
            }
    }
} /// class end
