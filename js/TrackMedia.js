import Track from './Track.js';
import FragmentMedia from './FragmentMedia.js';
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
        
        
        this.fragmentAdded = function(frg){
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
            let tmp = {
                path:    path,
                start_s: start_s,
                end_s:   end_s,
                track_id:this.getId(),
                int_id:  this.getInterviewId() 
            };
            tmp[id] = parseInt((new Date()).getTime());
//            this.fragmentAdded(tmp);
            __dbClient.send(this.getId()+'addMediaFragment',tmp);
        }
        __dbClient.addSubscriber(this.getId()+'addMediaFragment',this.fragmentAdded.bind(this));
        //TODO 28.05.2018 2:32 Доделать обновление фрагментов
        this.fragmentsLoaded = function(fragments){
            //TODO
              let trs = 150;
            fragments = [
            {
             id:111,
             track_id:this.getId(),
             start_s:2,
             end_s:10,
             int_id:this.getInterviewId(), 
             path:'audio/1.mp3'
         }
                ,
            {
             id:222,
             track_id:this.getId(),
             start_s:11,
             end_s:20,
             int_id:this.getInterviewId(),
             path:'audio/2.mp3'
         },
            {
             id:3333,
             track_id:this.getId(),
             start_s:trs+21,
             end_s:trs+35,
             int_id:this.getInterviewId(),
             path:'audio/3.mp3'
         }
            ];
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
            //TODO send sql command
          
//            this.fragmentsLoaded(tmp);
            __dbClient.send(this.getId()+'loadMediaFragments',{id:this.getId(), action:'LOAD'});
        }
        __dbClient.addSubscriber(this.getId()+'loadMediaFragments',this.fragmentsLoaded.bind(this));
    }
}
