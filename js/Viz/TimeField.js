import Subscriber from '../Subscriber.js';
import TimeString from '../TimeString.js';
export default class TimeField extends Subscriber{
    constructor(nodeParent, fragment,getData){
        super();
        var __fragment = fragment;
        this.onChange = function(time_s){
            __input.value = TimeString.sec2str(time_s);
        };
        var __input = document.createElement('input');
            __input.className = 'timeField';
        __input.onchange = function(e){
            let str = __input.value;
            let ms = TimeString.parseMs(str);
            if(ms===undefined){
                console.error('ms is undefined');
            }
            this.onChange(ms*0.001);
            __input.blur();
        }.bind(this);


        nodeParent.appendChild(__input);
        this.onUpdate = function(frg){
            __input.value = TimeString.sec2str(getData.call(this));
        }

    }
}
