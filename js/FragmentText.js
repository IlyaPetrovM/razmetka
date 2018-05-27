import Fragment from './Fragment.js';

/**************************************
    Fragment Text
**************************************/
export default class FragmentText extends Fragment{
    constructor(id, start_s, end_s, descr, track_id, interview_id, media_id){
        super(id,start_s,end_s,track_id,interview_id);
        var __descr = descr,
            __media_id = media_id;
        
        this.getDescr = function(){
            return __descr;
        }
        
        this.setDescr = function(txt){
            __descr = txt;
            this.update(this);
        }
        
        this.getMediaId = function(){
            return __media_id;
        }
//        this.type = 'text';
    }
}