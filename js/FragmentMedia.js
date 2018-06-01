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
        this.fragmentEdited = function(edit){
            __start_s = (edit.start_s || __start_s);
            __end_s = (edit.end_s || __end_s);
            this.update(this);
        }
        this.editFragment = function(start_s, end_s){
            let edit = {
                start_s:start_s,
                end_s:end_s
            };
            this.fragmentEdited(edit);
        }
//        this.audio.load();
        this.textFragments = new Array();
    }

}
