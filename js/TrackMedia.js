import Track from './Track.js';
/**************************************
TrackMedia
**************************************/
export default class TrackMedia extends Track{
    constructor(title,id,wsClient){
        super(title,id,wsClient);
        var thistrack=this;
        document.addEventListener('checkIntersect',
        function(e){
                console.log('checkIntersect',e);
            var ivl = thistrack.intervals.filter(function(interval){
                return interval.index == e.index;
            })[0];
            if(ivl!=undefined){
            if(!thistrack.intersectAny(e.start_s,e.end_s,e.index)){
                var motionApprovedMediaEvent = new CustomEvent('motionApprovedMedia');
                motionApprovedMediaEvent.start_s = e.start_s;
                motionApprovedMediaEvent.end_s = e.end_s;
                motionApprovedMediaEvent.index = e.index;
                motionApprovedMediaEvent.step_s = e.step_s;
                document.dispatchEvent(motionApprovedMediaEvent);
            }else{
                alert("Элементы не должны пересекаться");
            }}
        });
    }
}
