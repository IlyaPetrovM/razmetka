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
            console.log('audio '+path+' loaded');
        }
        var __start_s = start_s,
            __end_s = end_s;

//        this.audio.load();
        this.textFragments = new Array();
    }

}
