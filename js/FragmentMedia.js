import Fragment from "./Fragment.js";

/**************************************
    Fragment Media
**************************************/
export default class FragmentMedia extends Fragment{
    constructor(id, path, start_s, end_s, track_id, interview_id){
        super(  id, start_s, end_s, track_id, interview_id);
        this.cursorOn = false;
        this.path = path;
        this.audio = new Audio(path);
        this.audio.onload = function(){
        }
//        this.audio.load();
        this.textFragments = new Array();
    }

}
