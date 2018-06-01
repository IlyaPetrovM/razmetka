import Fragment from './Fragment.js';

/**************************************
    Fragment Text
**************************************/
export default class FragmentText extends Fragment{
    constructor(id, start_s, end_s, descr, track_id, interview_id, media){
        super(id,start_s,end_s,track_id,interview_id);
        var __descr = descr,
            __media = media;
        
        this.getMedia = function(){
            return __media;
        }
        this.getDescr = function(){
            return __descr;
        }
        
        this.setDescr = function(txt){
            __descr = txt;
            this.update(this);
        }
//        this.type = 'text';
    }
}
