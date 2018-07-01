import Fragment from './Fragment.js';
const Act = new exports.Act();

/**************************************
    Fragment Text
**************************************/
export default class FragmentText extends Fragment{
    constructor(__id, __start_s, __end_s, __track_id, __interview_id, dbClient, descr, media){
        super(  __id, __start_s, __end_s, __track_id, __interview_id, dbClient);
        var __descr = descr,
            __media = media,
            __dbClient = dbClient;
         this.getEndS = function(){
            return __end_s;
        }
        this.getStartS = function(){
            return __start_s;
        }
        this.getTableName = function(){
            return 'IntervalText';
        }
        this.getMedia = function(){
            return __media;
        }
        this.getDescr = function(){
            return __descr;
        }
        this.descrSet = function(msg){
            __descr = msg.data.descr;
            this.update(this);
        }
        this.setDescr = function(txt){
            if(txt.length > 2048) alert('Текст не может быть длиннее 2048 символов');
            //TODO setDescr
            let sql = {
                action: Act.UPDATE,
                id: this.getId(),
                table: this.getTableName(),
                data: {descr: txt}
            }
            __dbClient.send(__id+'setDescr',sql);
        }
        __dbClient.addSubscriber(__id+'setDescr',this.descrSet.bind(this));

        this.fragmentEdited = function(edit){
            __start_s = edit.data.start_s;
            __end_s = edit.data.end_s;
            this.update(this);
        }
        this.editFragment = function(st_s, en_s){

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
             __dbClient.send(__id+(__track_id+'editTextFragment'),sql);
        }
        __dbClient.addSubscriber(__id+(__track_id+'editTextFragment'),this.fragmentEdited.bind(this));

//        this.type = 'text';
    }
}
