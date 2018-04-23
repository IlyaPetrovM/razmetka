
/**************************************
VizTrack
**************************************/
export default class VizTrack{
    constructor(parent,track){
        this.div = document.createElement('div');
        this.div.className = "Track";
        this.div.track = track; 
        this.div.title = track.id + " " +track.title;
                
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

        parent.appendChild(this.div);
    }
    addInterval(e){
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
