/**************************************
 VizInterview
**************************************/
import Subscriber from '../Subscriber.js';

import Interview from '../Interview.js';
import TrackMedia from '../TrackMedia.js';
import TrackText from '../TrackText.js';


import Timeline from './Timeline.js';
import CursorPlay from './CursorPlay.js';
import MenuFragmentControls from './MenuFragmentControls.js';

import VizTrackMedia from './VizTrackMedia.js';
import VizTrackText from './VizTrackText.js';
import TimeDisplay from './TimeDisplay.js';

export default class VizInterview extends Subscriber{
    constructor(parentNode,interview){
        super();
        var __vizTracks = {};
        var __interview = interview;
        var __parentNode = parentNode;
        
        var __parentDiv = document.createElement('div');
        __parentNode.appendChild(__parentDiv);
        document.title = interview.getId()+' '+interview.getTitle();
        
        var __seq = document.createElement('div');
        __seq.className = 'sequence';
        
        var __trackControlPanel = document.createElement('div');
        __trackControlPanel.id = 'trackChooserPanel';
       
        
        var __wrapperCursor = document.createElement('div');
        __wrapperCursor.className='wrapperCursor';
        __wrapperCursor.id='wrapperCursor';
        
        var __wrapper = document.createElement('div');
        __wrapper.className = 'wrapper';
        __wrapper.id = 'wrapper';
        
        var __controls = document.createElement('div');
        __controls.className = 'controls';
        __controls.id = 'controls';
        
        var __descr = document.createElement('div');
        __descr.id='descr';
        
        var __panelMedia = document.createElement('div');
        __panelMedia.className='panelMedia';
        
        var __panelText = document.createElement('div');
        __panelText.className='panelText';
        
        __interview.trackMediaCreated = function(track){
                new VizTrackMedia(__panelMedia,track,__trackControlPanel);
        }.bind(this);
        __interview.trackTextCreated = function(track){
                new VizTrackText(__panelText,track,__trackControlPanel);
        }.bind(this);   
        console.log('0....load Interview');
        
        ButtonAddTrackMedia();
        ButtonAddTrackText();
        
        var __buttonPlay = document.createElement('button');
        __buttonPlay.innerText = '▶';
        __buttonPlay.id = 'buttonPlay';
        __buttonPlay.onclick = function(e){
            if(__buttonPlay.innerText=='||'){        
                __buttonPlay.innerText='▶';
                
                var eventStop = new CustomEvent('stopPlaying');
                document.dispatchEvent(eventStop);
            }
            else{
                __buttonPlay.innerText='||';
                var startPlayEvent = new CustomEvent('startPlay');
                document.dispatchEvent(startPlayEvent);
            }
        };
        
        var __buttonPlayAndMark = document.createElement('button');
        __buttonPlayAndMark.innerText='M▶';
        __buttonPlayAndMark.id = 'buttonPlayAndMark';
        
        

        document.addEventListener('cantPlay',function(){
            __buttonPlay.innerText = '▶';
            __buttonPlayAndMark.innerText='M▶';
        },false);
        __buttonPlayAndMark.onclick = function(e){
            if(__buttonPlay.innerText=='||'){        
                __buttonPlay.innerText='▶';
                __buttonPlayAndMark.innerText = 'M▶';
                var stopPlayAndMarkEvent = new CustomEvent('stopPlayAndMark');
                document.dispatchEvent(stopPlayAndMarkEvent);
            }
            else{
                console.log(timeline);
                if(cp.time_s < timeline.len_s - 0.05){
                __buttonPlay.innerText='||';
                __buttonPlayAndMark.innerText = 'M||';
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
        
        var __trackControlPanelMedia = document.createElement('div');
        __trackControlPanelMedia.id = 'trackControlPanelMedia';
        __trackControlPanel.appendChild(__trackControlPanelMedia);
        
        var __trackControlPanelText = document.createElement('div');
        __trackControlPanelText.id = 'trackControlPanelText';
        __trackControlPanel.appendChild(__trackControlPanelText);
        
        __controls.appendChild(__buttonPlay);
        __controls.appendChild(__buttonPlayAndMark);
        var timeline = new Timeline(__seq,__controls);
        var cp = new CursorPlay(timeline);
        var __bigwrapper = document.createElement('div');
        __bigwrapper.id = 'bigwrapper';
        __seq.appendChild(__panelMedia);
        __seq.appendChild(__panelText); 
        new MenuFragmentControls(__controls);
        __wrapper.appendChild(__seq);
        let timeDisplay = new TimeDisplay(__wrapperCursor,__controls) 
        __wrapperCursor.appendChild(__wrapper);
        __bigwrapper.appendChild(__trackControlPanel);
        __bigwrapper.appendChild(__wrapperCursor);
        __parentDiv.appendChild(__controls);
        __parentDiv.appendChild(__bigwrapper);
        __parentDiv.appendChild(__descr);
        
        this.onUpdate = function(itw){
            document.title = itw.getId()+' '+itw.getTitle();
            
            for(let id in itw.getTracks()){
                let track = itw.getTracks()[id];
                console.assert(id == track.getId(),'ids are different!',typeof id,typeof track.getId());
                if( __vizTracks[track.getId()] === undefined){
                    switch(track.getType()){
                        case 'Media':
                            __vizTracks[track.getId()] = new VizTrackMedia(__panelMedia,track,__trackControlPanelMedia);
                            track.addSubscriber(__vizTracks[track.getId()]);
                            console.log(track);
                            track.update(track);
                            break;
                        case 'Text':
                            __vizTracks[track.getId()] = new VizTrackText(__panelText,track,__trackControlPanelText);
                            track.addSubscriber(__vizTracks[track.getId()]);
                            break;
                        default:
                            console.error("Неизвестный тип трека",track.getType());
                    }
                }
            }
        }
        
// private
        function ButtonAddTrackMedia() {
            var __butAddTrackMedia = document.createElement('button');
            __butAddTrackMedia.interview = __interview;
            __butAddTrackMedia.onclick = function(){
                let tmp = prompt('Введите название дорожки:');
                if(tmp){
                    __interview.addTrackMedia(tmp);
                }
            };
            __butAddTrackMedia.innerText = 'Добавить\n аудио-дорожку';
            __butAddTrackMedia.title = 'Нажмите, чтобы добавить аудио';
            __controls.appendChild(__butAddTrackMedia);
        }

        function ButtonAddTrackText() {
            var __butAddTrackText = document.createElement('button');
            __butAddTrackText.interview = interview;
            __butAddTrackText.onclick = function(){
                let tmp = prompt('Введите название дорожки:');
                if(tmp){
                    __interview.addTrackText(tmp);
                }
            };
            __butAddTrackText.innerText = 'Добавить\nтекстовую дорожку'; 
            __controls.appendChild(__butAddTrackText);
        }
    }   
}

 var parseSearch = function(str){
            let query = {};
            str.split('?').forEach(function(s){
                let pairs = s.split('&');
                pairs.forEach(function(p){
                    let tmp=p.split('=');
                    let key = tmp[0];
                    let value = tmp[1];
                    query[key] = value;
                });
            });
            return query;
        }
        let s = window.location.search;
        let q = parseSearch(s);
        console.info('Interview id:'+q['id']);
        if(q['id']){
            document.title='Интервью '+q['id'];
        }
console.log('load interview');
var tmpInterview = new Interview(q['id'],'Деревенское интервью',"2018-05-12");
var vi = new VizInterview(document.body,tmpInterview);
tmpInterview.addSubscriber(vi);
tmpInterview.loadMe(q['id']);