import Track from './Track.js';
export default class TrackText extends Track{
        constructor(title, id, int_id, wsClient){
        super(title, id, int_id, wsClient);
        var __fragments = {};
        this.getFragments = function(){return __fragments;}
        this.getType = function(){return 'Text';}
    }
}