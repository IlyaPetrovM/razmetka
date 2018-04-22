/**************************************
 VizInterview
**************************************/
import Timeline from './Timeline.js';
import CursorPlay from './CursorPlay.js';
import MenuIntervalControls from './MenuIntervalControls.js';

import TrackMedia from './TrackMedia.js';
import TrackText from './TrackText.js';

import VizTrackMedia from './VizTrackMedia.js';
import VizTrackText from './VizTrackText.js';
import TimeDisplay from './TimeDisplay.js';

export default class VizInterview{
    addMediaButton(interview, panelMedia, controls) {
        this.butAddTrackMedia = document.createElement('button');
        this.butAddTrackMedia.interview = interview;
        this.butAddTrackMedia.onclick = function(){
            let trackMedia = new TrackMedia('Дорожка аудио');
            
            this.interview.addTrackMedia(trackMedia,function(){
                new VizTrackMedia(panelMedia, trackMedia);
            });
        };
        this.butAddTrackMedia.innerText = 'Добавить аудио-дорожку';
        this.butAddTrackMedia.title = 'Нажмите, чтобы добавить аудио';
        controls.appendChild(this.butAddTrackMedia);
    }

    constructor(parentNode,interview){
        
        this.parentNode = parentNode;
        var parent = document.createElement('div');
        this.parent = parent;
        parentNode.appendChild(this.parent);
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
        

        this.addMediaButton(interview, panelMedia, controls); 
        
        this.butAddTrackText = document.createElement('button');
        this.butAddTrackText.interview = interview;
        this.butAddTrackText.onclick = function(){
            let trackText = new TrackText('Текстовая дорожка');
            if(this.interview.addTrackText(trackText)){
            console.log('Track');
                new VizTrackText(panelText,trackText);
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
    show(){
        this.parent.classList.remove('hidden');
    }
    hide(){
//        this.parent.classList.add('hidden');
        this.parentNode.removeChild(this.parent);
    }
}