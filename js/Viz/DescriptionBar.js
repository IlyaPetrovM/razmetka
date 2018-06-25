import Subscriber from '../Subscriber.js';
import TimeField from './TimeField.js';

export default class DescriptionBar extends Subscriber{
    constructor(parentNode, fragment, blockText){
        super();
        var __fragment = fragment;
        var __blockText = blockText;
        var __row = document.createElement('div');
        var __inputDescr = document.createElement('textarea');
        var cursorPos = '';
        __row.className = 'ivlDescr';
        this.getRow = function(){
            return __row;
        }

        __inputDescr.id = ('textDiscr');
        __inputDescr.className = 'textDescr';
        __inputDescr.innerHTML = __fragment.getDescr();

        var delayIsActive = false;



        __inputDescr.addEventListener('keydown', function(e){
            autosize();
            console.log(__inputDescr.rows);
            if(delayIsActive){
               return;
            }
            var t = setTimeout(function(){
                    __fragment.setDescr(__inputDescr.value);
                    console.log('send Text');
                    delayIsActive = false;
            },3000);
            delayIsActive = true;
            __row.classList.add('editButNotSentRow');
        }.bind(this));



        this.setBlockText = function(block){
            __blockText = block;
            __row.addEventListener('click',__blockText.scrollIntoView);
        }
        if(blockText!==undefined){
            this.setBlockText(blockText);
        }

        var __start = new TimeField(__row,__fragment,__fragment.getStartS),
            __end = new TimeField(__row,__fragment,__fragment.getEndS);
        __start.onChange = function(time_s){
            __fragment.setStartS(time_s);
        }
        __end.onChange = function(time_s){
            __fragment.setEndS(time_s);
        }
        __fragment.addSubscriber(__start);
        __fragment.addSubscriber(__end);

        this.scrollIntoView = function(){
            __row.scrollIntoView(false);
            __row.classList.toggle('hover');
        }

        this.onUpdate = function(frg){
            __inputDescr.value = frg.getDescr();
            __row.classList.remove('editButNotSentRow');

            __row.classList.toggle('updatedRow');
            setTimeout(function(){
                __row.classList.toggle('updatedRow');
            },500);
        }
        __row.appendChild(__inputDescr);
        parentNode.appendChild(__row);

        function autosize(){
          setTimeout(function(){
            __inputDescr.style.cssText = 'height:auto; padding:0';
            // for box-sizing other than "content-box" use:
             __inputDescr.style.cssText = '-moz-box-sizing:content-box';
            __inputDescr.style.cssText = 'height:' + __inputDescr.scrollHeight + 'px';
          },0);
        }
        autosize();
        this.focus = function(){
            __inputDescr.focus();
        }
        this.onPublisherRemove = function(){
            parentNode.removeChild(__row);
        }
    }
}
