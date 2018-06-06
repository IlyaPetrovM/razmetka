import Track from './Track.js';
import FragmentText from './FragmentText.js';
export default class TrackText extends Track{
        constructor(title, id, interview, wsClient){
        super(title, id, interview, wsClient);
        var __fragments = {};
        var __dbClient = wsClient;
        this.getFragments = function(){return __fragments;}
        this.getType = function(){return 'Text';}
        var __this = this;
        function getMediaById(media_id){
            let tracks = __this.getInterview().getTracks();
            for(let i in tracks){
//                console.log(tracks[i].getFragments()[media_id]!==undefined);
                if(tracks[i].getFragments()[media_id]!==undefined){
                    return tracks[i].getFragments()[media_id];
                }
            }
            return 1;
        }

        this.fragmentAdded = function(f){
            __fragments[f.id] = new FragmentText(f.id,
                                                    f.start_s,
                                                    f.end_s,
                                                    f.descr,
                                                    f.track_id,
                                                    f.int_id,
                                                    getMediaById(f.media_id),
                                                    __dbClient);
            this.update(this);
        }

        this.addFragment = function(start_s, end_s, descr, media_id){
            let tmp = {         id:(new Date).getTime(),
                                start_s:start_s,
                                end_s:end_s,
                                descr:descr,
                                track_id:this.getId(),
                                int_id:interview.getId(),
                                media_id:media_id};
            this.fragmentAdded(tmp);
        }

        this.fragmentsLoaded = function(data){
            data.forEach(function(f){
                __fragments[f.id] = new FragmentText(f.id,
                                                    f.start_s,
                                                    f.end_s,
                                                    f.descr,
                                                    f.track_id,
                                                    f.int_id,
                                                    getMediaById(f.media_id),
                                                    __dbClient);
            });
            this.update(this);
        }
        this.loadFragments = function(){
            let tmp = [
                {
                    id:1,
                    start_s:2,
                    end_s:4,
                    descr:"Подробная опись фрагмента",
                    media_id:111,
                    track_id:this.getId(),
                    int_id:this.getInterviewId()
                },
                {
                    id:2,
                    start_s:5,
                    end_s:6,
                    descr:"Всё очень<br>интересно",
                    media_id:111,
                    track_id:this.getId(),
                    int_id:this.getInterviewId()
                },
                {
                    id:3,
                    start_s:7,
                    end_s:10,
                    descr:"Просто захватывающе!",
                    media_id:111,
                    track_id:this.getId(),
                    int_id:this.getInterviewId()
                }
            ];
            this.fragmentsLoaded(tmp);
        }
    }
}
