import Fragment from "./Fragment.js";
const Act = new exports.Act();

/**************************************
    Fragment Media
**************************************/
export default class FragmentMedia extends Fragment{
    constructor(id, path, start_s, end_s, track_id, interview_id,dbClient){
        super(  id, start_s, end_s, track_id, interview_id,dbClient);
        this.cursorOn = false;
        this.path = path;
        this.audio = new Audio(path);
        this.audio.onload = function(){
            console.log('audio '+path+' loaded');
        }
        var __textFragments = {};
        this.addTextFragment = function(frg){
            __textFragments[frg.getId()] = frg;
            console.log(__textFragments);
        }
        this.removeTextFragment = function(frg){
            __textFragments[frg.getId()] = undefined;
        }

        var __start_s = start_s,
            __end_s = end_s,
            __id = id,
            __track_id = track_id,
            __dbClient = dbClient;

        this.getEndS = function(){
            return __end_s;
        }
        this.getStartS = function(){
            return __start_s;
        }
        this.getTableName = function(){
            return 'IntervalMedia';
        }
        this.fragmentEdited = function(edit){
            let new_start_s = edit.data.start_s
            let step_s = new_start_s - __start_s;
            __start_s = edit.data.start_s;
            __end_s = edit.data.end_s;


            for(let i in __textFragments){
                __textFragments[i].editFragment(__textFragments[i].getStartS() + step_s,
                                                __textFragments[i].getEndS()   + step_s);
            }
            console.log('3. edit fragment');

            this.update(this);
        }
        this.editFragment = function(st_s, en_s){
            console.log('2. edit fragment');

            if(st_s<0) en_s -= st_s, st_s = 0.0; // Запретить перемещать в сторону нуля
            let edit = {
                start_s:st_s,
                end_s:en_s
            };
            let sql = {
                action: Act.UPDATE,
                table: this.getTableName(),
                id: __id,
                data:edit
            };
             __dbClient.send(__id+(__track_id+'editMediaFragment'),sql);
        }
        __dbClient.addSubscriber(__id+(__track_id+'editMediaFragment'),this.fragmentEdited.bind(this));


//        this.audio.load();
//        this.textFragments = new Array();
    }

}
