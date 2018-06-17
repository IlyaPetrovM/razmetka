import Fragment from './Fragment.js';
const Act = new exports.Act();

/**************************************
    Fragment Text
**************************************/
export default class FragmentText extends Fragment{
    constructor(id, start_s, end_s, descr, track_id, interview_id, media,dbClient){
        super(id,start_s,end_s,track_id,interview_id,dbClient);
        var __descr = descr,
            __media = media,
            __dbClient = dbClient;
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
            __dbClient.send(id+'setDescr',sql);
        }
        __dbClient.addSubscriber(id+'setDescr',this.descrSet.bind(this));
//        this.type = 'text';
    }
}
