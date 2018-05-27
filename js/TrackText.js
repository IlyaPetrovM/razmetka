import Track from './Track.js';
export default class TrackText extends Track{
        constructor(title,id,wsClient){
        super(title,id,wsClient);
        this.getType = function(){return 'Text';}
    }
}