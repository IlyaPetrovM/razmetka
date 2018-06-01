import Subscriber from '../Subscriber.js';
/**************************************
VizTrack
**************************************/
export default class VizTrack extends Subscriber{
    constructor(parent,track,panelParent){
        super();
        var __track = track;
//        __track.loadFragments();
        
        this.div = document.createElement('div');
        this.div.className = "Track";
        this.div.track = track; 
        this.div.title = track.getId() + " " +track.getTitle();
                
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
        this.buttonDelete = document.createElement('button');
        this.buttonDelete.className = 'buttonDeleteTrack';
        this.buttonDelete.innerHTML = 'x';
        this.buttonDelete.onclick = function(e){
            if(confirm('Вы уверены что хотите удалить дорожку?')){
//            this.div.track.remove.bind(this.div.track);
                __track.removeTrack();
            }else{
                console.log('Отмена');
            }
        }

        this.panel = document.createElement('div');
        this.panel.className = 'trackPanel';
        
        this.panel.appendChild(this.radio);
        this.panel.appendChild(this.buttonDelete);
        panelParent.appendChild(this.panel);
        parent.appendChild(this.div);
//        
//        this.onUpdate = function(track){
//            console.log('update track');
//            this.div.title = track.getId() + " " +track.getTitle();
//        }
        this.onPublisherRemove = function(){
            console.log(this.panel);
            panelParent.removeChild(this.panel);
            parent.removeChild(this.div);
        }
    }

    addFragment(e){
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
