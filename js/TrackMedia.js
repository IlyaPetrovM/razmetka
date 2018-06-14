import Track from './Track.js';
import FragmentMedia from './FragmentMedia.js';
const Act = new exports.Act();
/**************************************
TrackMedia
**************************************/
export default class TrackMedia extends Track{
    constructor(title, id, int_id, dbClient){
        super(title, id, int_id, dbClient);
        var thistrack=this;
        var __fragments = {};
        var __dbClient = dbClient;
        this.getFragments = function(){return __fragments;}
//        const __id = id;
//        var __title = title;
        this.getType = function(){return 'Media';}
        
//        document.addEventListener('checkIntersect',
//        function(e){
//                console.log('checkIntersect',e);
//            var ivl = thistrack.fragments.filter(function(fragment){
//                return fragment.index == e.index;
//            })[0];
//            if(ivl!=undefined){
//            if(!thistrack.intersectAny(e.start_s,e.end_s,e.index)){
//                var motionApprovedMediaEvent = new CustomEvent('motionApprovedMedia');
//                motionApprovedMediaEvent.start_s = e.start_s;
//                motionApprovedMediaEvent.end_s = e.end_s;
//                motionApprovedMediaEvent.index = e.index;
//                motionApprovedMediaEvent.step_s = e.step_s;
//                document.dispatchEvent(motionApprovedMediaEvent);
//            }else{
//                alert("Элементы не должны пересекаться");
//            }}
//        });
        
        
        this.fragmentAdded = function(msg){
            let frg = msg.data;
            __fragments[frg.id] = new FragmentMedia(frg.id,
                                                    frg.path,
                                                    frg.start_s,
                                                    frg.end_s, 
                                                    frg.track_id, 
                                                    frg.int_id,
                                                    __dbClient);
            this.update(this);
        }
        this.addFragment = function(path, start_s, end_s){
            if(path===undefined) throw TypeError('path to media is undefined');
            else if(start_s===undefined) throw TypeError('start_s is undefined');
            else if(end_s===undefined) throw TypeError('end_s is undefined');
            let data = {
                path:    path,
                start_s: start_s,
                end_s:   end_s,
                track_id:this.getId(),
                int_id:  this.getInterviewId() 
            };
            let msg = {
                action:Act.CREATE,
                table:'IntervalMedia',
                data:data
            };
            __dbClient.send(this.getId()+'addMediaFragment',msg);
        }
        __dbClient.addSubscriber(this.getId()+'addMediaFragment',this.fragmentAdded.bind(this));
        //TODO 28.05.2018 2:32 Доделать обновление фрагментов
        this.fragmentsLoaded = function(msg){
            let fragments = msg.data;
            if(fragments.length<=0) return;
            for(let i in fragments){
                let frg = fragments[i];
                __fragments[frg.id] = new FragmentMedia(frg.id,
                                                        frg.path,
                                                        frg.start_s,
                                                        frg.end_s, 
                                                        frg.track_id, 
                                                        frg.int_id,
                                                       __dbClient);
            }
            this.update(this);
        }
        this.loadFragments = function(){
            let sql = {
                action:Act.LOAD,
                table:'IntervalMedia',
                where:'track_id='+this.getId()
            };
            __dbClient.send(this.getId()+'loadMediaFragments',sql);
        }
        __dbClient.addSubscriber(this.getId()+'loadMediaFragments',this.fragmentsLoaded.bind(this));
    }
}
