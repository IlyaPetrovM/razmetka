import Subscriber from '../Subscriber.js';
import TimeField from './TimeField.js';
export default class DescriptionBar extends Subscriber{
    constructor(parentNode, fragment, blockText){
        super();
        var __fragment = fragment;
        var __blockText = blockText;
        var __row = document.createElement('div');
        var __inputDescr = document.createElement('div');

        __row.className = 'ivlDescr';

        __inputDescr.id = ('textDiscr');
        __inputDescr.className = 'textDescr';
        __inputDescr.innerHTML = __fragment.getDescr();
        __inputDescr.setAttribute('contenteditable',true);
        var delayIsActive = false;



        /// TODO !!!!! Нужно каким-то образом вызывать метод изменения описания фрагмента!!!!!! 2018.06.13 2:22
        __inputDescr.addEventListener('keyup', function(e){
            if(delayIsActive){
               return;
            }
            var t = setTimeout(function(){
                    __fragment.setDescr(__inputDescr.innerHTML);
                    console.log('send Text');
                    delayIsActive = false;
            },3000);
            delayIsActive = true;
            __row.classList.add('editButNotSentRow');
//            __inputDescr.innerHTML='';
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
            console.log(frg.getDescr());
            __inputDescr.innerHTML = frg.getDescr();
            __row.classList.remove('editButNotSentRow');

            __row.classList.toggle('updatedRow');
            setTimeout(function(){
                __row.classList.toggle('updatedRow');
            },500);
        }

        __row.appendChild(__inputDescr);
        parentNode.appendChild(__row);
    }
}
