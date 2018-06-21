import Subscriber from '../Subscriber.js';
export default class Passport extends Subscriber {
    constructor(parentNode, interview){
        super();
//
//        var sendStatus = document.createElement('i');
//        sendStatus.innerHTML = 'Данные сохранены';
//        sendStatus.className = 'sendStatus';

        var __form = document.createElement('form');
        __form.id = 'passport';

        var __inputInformants = document.createElement('input');
        __inputInformants.name = 'inputInformants';
        __inputInformants.placeholder = 'Информанты';
        var delay = [false,false,false];
        __inputInformants.onkeyup = function(e){
            if(delay[0]){
                return;
            }
            delay[0] = true;
            __form.classList.add('editForm');
            setTimeout(function(e){
                delay[0] = false;
                interview.setInformants(__inputInformants.value);
            }, 5000);
        }

        var __inputReporters = document.createElement('input');
        __inputReporters.name = 'inputReporters';
        __inputReporters.placeholder = 'Собиратели';
        __inputReporters.onkeyup = function(e){
            if(delay[1]){
                return;
            }
            delay[1] = true;
            __form.classList.add('editForm');
            setTimeout(function(e){
                delay[1] = false;
                interview.setReporters(__inputReporters.value);
            }, 5000);
        }

        var __inputExterier = document.createElement('textarea');
        __inputExterier.name = 'inputEtc';
        __inputExterier.placeholder = 'Обстоятельства интервью';
        __inputExterier.onkeyup = function(e){
            if(delay[2]){
                return;
            }
            delay[2] = true;
            __form.classList.add('editForm');
            setTimeout(function(e){
                delay[2] = false;
                interview.setExterier(__inputExterier.innerText);
            }, 5000);
        }

        var __wrapper = document.createElement('div');
        __wrapper.classList = 'passportWrapper';

        var __buttonHide = document.createElement('button');
        var hidden = false;
        __buttonHide.innerHTML = 'Свернуть паспорт интервью';
        __buttonHide.onclick = function(){
            if(hidden){
                __buttonHide.innerHTML = 'Свернуть паспорт интервью';
            }else{
                __buttonHide.innerHTML = 'Показать паспорт интервью';
            }
            hidden = !hidden;
            __form.classList.toggle('hidden');
        }

        __form.appendChild(__inputReporters);
        __form.appendChild(__inputInformants);
        __form.appendChild(__inputExterier);

        __wrapper.appendChild(__form);
        __wrapper.appendChild(__buttonHide);

        parentNode.appendChild(__wrapper);

        this.onUpdate = function(itw){
            __inputInformants.value = itw.getInformants();
            __inputReporters.value = itw.getReporters();
            __inputExterier.innerText = itw.getExterier();

            __form.classList.remove('editForm');
            __form.classList.toggle('savedForm');
            setTimeout(function(){
                __form.classList.toggle('savedForm');
            },1000);
        }
    }
}
