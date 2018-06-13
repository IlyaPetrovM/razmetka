import Fragment from './Fragment.js';

/**************************************
    Fragment Text
**************************************/
export default class FragmentText extends Fragment{
    constructor(id, start_s, end_s, descr, track_id, interview_id, media,dbClient){
        super(id,start_s,end_s,track_id,interview_id,dbClient);
        var __descr = descr,
            __media = media,
            __dbClient = dbClient;
        
        this.getMedia = function(){
            return __media;
        }
        this.getDescr = function(){
            return __descr;
        }
        this.descrSet = function(txt){
            __descr = txt;
            this.update(this);
        }
        this.setDescr = function(txt){
            console.log(txt);
            __dbClient.send(id+'setDescr',txt);
        }
        __dbClient.addSubscriber(id+'setDescr',this.descrSet.bind(this));
//        this.type = 'text';
    }
}
