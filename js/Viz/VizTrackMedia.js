import VizTrack from './VizTrack.js';
import VizFragmentMedia from './VizFragmentMedia.js';
import FragmentMedia from '../FragmentMedia.js';
/**************************************
 VizTrackMedia
**************************************/
export default class VizTrackMedia extends VizTrack{
    constructor(parent, track, parentPanel,timeline, cursorPlay){
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
                __vizFragments[frg.getId()] = new VizFragmentMedia(__div, frg,timeline, cursorPlay);
                frg.addSubscriber(__vizFragments[frg.getId()]);
                frg.update(frg);
            }
        }

        this.createFragment = function(path, audio, offsetX) { // event appends to the enduuu
            __track.addFragment(path,
                                VizTrack.pix2sec(offsetX),
                                VizTrack.pix2sec(offsetX) + audio.duration);
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


    addFragmentMedia(offsetX) {
        console.log('hello form!');
        var fileInput = document.createElement('input');
        var __form = document.createElement('form');
        var progressBar = document.createElement('progress');
        progressBar.max = '100';
        progressBar.value = '0';
        progressBar.id = 'progressBar';
        progressBar.style.display = 'none';
        fileInput.id = 'fileInput';
        fileInput.name = 'audioFile';
        fileInput.type = 'file';
        __form.id = 'resetform';
        __form.action = 'fileupload';
        __form.appendChild(fileInput);
        __form.appendChild(progressBar);
        document.body.appendChild(__form);
        
        var sendForm = function(form, callback){
            if(!window.FormData){
                alert('Ваш браузер не поддерживает FormData - воспользуйтесь последней версией Google Chrome или Firefox');
                return;
            }
            if(fileInput.files[0].type != 'audio/mp3'){
                fileInput.value = '';
                alert('Принимаются только mp3 файлы!');
                return false;
            }
            fileInput.style.display = 'none';
            progressBar.style.display = 'block';
//            console.dir(fileInput);
            var xhr = new XMLHttpRequest();
            xhr.open('POST',form.action);
            xhr.onload = callback;
            xhr.upload.onprogress = function(event){
                progressBar.value = (event.loaded / event.total) * 100;
            }
            let formData = new FormData(form);
            xhr.send(formData);
        }
        fileInput.onchange = sendForm.bind(this,__form,function(e){
                var path = e.currentTarget.responseText;
                var audio = new Audio(path);
                audio.parentEvent = e;
                audio.ondurationchange =
                    this.createFragment.bind(this, path, audio, offsetX); // and Event in the end
                document.body.removeChild(__form);
            }.bind(this));
    }

    processClick(clickEvent){
            if(clickEvent.target.track != null){
                this.addFragmentMedia(clickEvent.offsetX);
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
