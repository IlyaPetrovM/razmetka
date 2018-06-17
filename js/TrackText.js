import Track from './Track.js';
import FragmentText from './FragmentText.js';
const Act = new exports.Act();
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

        this.fragmentAdded = function(msg){
            let f = msg.data;
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
            let data = {
                start_s:start_s,
                end_s:end_s,
                descr:descr,
                track_id:this.getId(),
                int_id:interview.getId(),
                media_id:media_id /// TODO
            };
            let sql = {
                action:Act.CREATE,
                table:'IntervalText',
                data:data
            }
//            this.fragmentAdded(sql);
            __dbClient.send(this.getId()+'addTextFragment',sql);
        }
        __dbClient.addSubscriber(this.getId()+'addTextFragment',this.fragmentAdded.bind(this));
        

        this.fragmentsLoaded = function(msg){
            let data = msg.data;
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
            let sql = {
                action:Act.LOAD,
                table:'IntervalText',
                where:'track_id='+this.getId()
            }
            __dbClient.send(this.getId()+'loadTextFragments',sql);
//            this.fragmentsLoaded(tmp);
        }
        __dbClient.addSubscriber(this.getId()+'loadTextFragments',this.fragmentsLoaded.bind(this));
    }
}
