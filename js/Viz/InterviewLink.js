import Subscriber from '../Subscriber.js';
import TimeString from '../TimeString.js';

export default class InterviewLink extends Subscriber{
    constructor(inte, parentNode){
        super();
        if(inte === undefined) throw TypeError('interview is undefined');
        var __row = document.createElement('div');
        __row.className = 'interviewLink';

        var __a = document.createElement('a');
//        __a.className = 'interviewLink';
        var __interview = inte;
        var __parentNode = parentNode;
        
        __a._id = inte.id;
       
        updateLink();

        var drawControl = function(targetItem, e){
            let rect = __a.getBoundingClientRect();

//            this.editGroupButtons.style.top = rect.y + 'px';
//            this.targetItem = targetItem;
        }


//        __a.onmouseover = drawControl.bind(__parentNode,__a);
        __a.href = `interview.html?id=${__interview.getId()}`;

        this.onUpdate = function(iw){
            updateLink();
        }
        
        this.onPublisherRemove = function(){
            __parentNode.removeChild(__row);
        }

        
        /* private methods */
        function updateLink () {
            let date = TimeString.date2yyyy_mm_dd(__interview.getDate());
            __a.innerHTML =`${__interview.getId()} ${date} ${__interview.getTitle()} ${__interview.getInformants()}`;
            __a.title = `Собиратели:\n${__interview.getReporters()}`;
        }

        var __editGroup = document.createElement('div');
        __editGroup.className = 'editGroupButtons';
        this.buttonDel = document.createElement('button');
        this.buttonDel.title = "Удалить";
        this.buttonDel.innerHTML = "&#10006;";
        this.buttonDel.className = 'buttonDel';
//        this.buttonEdit = document.createElement('button');
//        this.buttonEdit.title = "Редактировать";
//        this.buttonEdit.innerHTML = "&#9998;";
//        this.buttonEdit.className = "buttonEdit";
//        this.buttonEdit.onclick = function(){
//            let _data = {};
//            for(let key in __interview.data){
//                if(key !== 'id' && key !== 'tracks'){
//                    let val = prompt(`${key}`, __interview[key]);
//                    if(val){
//                            _data[key] = val;
//                    }
//                }
//            }
//            __interview.editInterview(_data);
//        };
//        __editGroup.appendChild(this.buttonEdit);

        this.buttonDel.onclick = function(){
            //TODO 09.04.2018
//            let id = this.targetItem._id;
            let res = confirm('Вы уверены, что хотите удалить "интервью '+ __interview.getId() + '" и всё его содержимое? Вернуть эту операцию будет невозможно!');
            if(res){
               __interview.removeInterview();
            }
        }

        __editGroup.appendChild(this.buttonDel);
        __row.appendChild(__a);
        __row.appendChild(__editGroup);
        parentNode.appendChild(__row);
    }    
}
