/**************
 InterviewChooser
 ******************/
import Interview from './Interview.js';
import InterviewLink from './InterviewLink.js';
import IDbTable from './IDbTable.js';

export default class InterviewChooser extends IDbTable{
    constructor(wsocket,parentNode){
        super(wsocket);
        this.div = document.createElement('div');
        this.div.id = 'interviewChooser';
        this.buttonAdd = document.createElement('button');
        this.buttonAdd.innerHTML = 'Добавить интервью';
        this.buttonAdd.id = 'createInterviewButton';
        this.buttonAdd.addEventListener('click',this.create.bind(this));
        this.div.appendChild(this.buttonAdd);
        
        this.buttonHide = document.createElement('button');
        this.buttonHide.innerHTML = 'X';
        this.buttonHide.id = 'buttonHide';
        this.buttonHide.onclick = this.hide.bind(this);
        
        this.interviewItems = {};
        
        this.editGroupButtons = document.createElement('div');
        this.editGroupButtons.id = 'editGroupButtons';
        this.targetItem = undefined;
        this.buttonEdit = document.createElement('button');
        this.buttonDel = document.createElement('button');
        this.buttonEdit.title = "Редактировать";
        this.buttonDel.title = "Удалить";
        this.buttonEdit.innerHTML = "&#9998;";
        this.buttonDel.innerHTML = "&#10006;";
        this.buttonEdit.className = "buttonEdit";
        this.buttonDel.className = 'buttonDel';
        this.buttonEdit.onclick = this.update.bind(this);
        this.buttonDel.onclick = this.remove.bind(this); // Чтобы передавать как параметр только один выбранный элемент
        
        this.editGroupButtons.appendChild(this.buttonEdit);
        this.editGroupButtons.appendChild(this.buttonDel);
        this.div.appendChild(this.editGroupButtons);
        parentNode.appendChild(this.div);
        parentNode.appendChild(this.buttonHide);
        this.parentNode = parentNode;
        
        this.wsClient.onopen = this.load.bind(this);  
    }
    
    get table(){
        return "Interview";
    }
    
    get sender(){
        return 'InterviewChooser';
    } 
    
    load(){
        super.load('Interview');
    }
    
    createInterview(data) {
        var inter = new Interview(data.title, data._date, this.wsClient,data.id);
        this.interviewItems[data.id] = new InterviewLink(inter,this);
        inter.ondelete = function(id){
            this.div.removeChild(this.interviewItems[id].a);
            delete this.interviewItems[id];
            console.log('delete ',this.interviewItems[id]);
        }.bind(this);
    }

    processLoad(msg) {
        for(let i in msg.result){
            let data = msg.result[i];
            this.createInterview(data);
        }
    }
    
    create(){
        let title_ = '', date_ = new Date('1992-01-13');
        let send = true;
        while(title_ === null || title_ === ''){
            title_ = prompt("Введите название интервью","Интервью 1");
            if(title_ === null){
                send = false;
                break;
            }
        }
        if(send){
             //TODO 09.04.2018 
            super.create({title: title_,_date:date_}, 'Interview');
        }
    }
    
    processCreate(msg){
        console.log('processCreate');
        this.createInterview(msg.data);
    }
    
    
    update(id,data,onClickEvent){
        let _data = {};
        let choice = this.interviewItems[this.targetItem._id].inte;
        for(let key in choice.data){
            if(key !== 'id' && key !== 'tracks'){
                let val = prompt(`${key}`, choice[key]);
                if(val){
                        _data[key] = val; 
                }
            }
        }
        choice.update(_data);
    }
    
    processUpdate(msg){
        throw Error('process update chooser');
        console.log('pass');
    }
    
    remove(_id,onClickEvent){
        //TODO 09.04.2018
        console.log(_id);
        let id = this.targetItem._id;
        let res = confirm('Вы уверены, что хотите удалить интервью?');
        if(res){
           this.interviewItems[id].inte.remove();
        }
    }
    
    processDelete(msg) {
        //TODO 09.04.2018
        this.interviewItems[msg.id].delete();
    }
    
    

   processError(msg){
       //TODO 09.04.2018
       alert('Данные отправленные в базу данных не были сохранены. Попробуйте ещё раз.');
   }
    
   hide(activeInterview){
       this.div.classList.add('hidden');
       this.buttonHide.innerHTML = 'Список интервью';
       this.buttonHide.onclick = this.show.bind(this);
       this.activeInterview = activeInterview;
       console.log(this.activeInterview);
   }
    show(){
        this.div.classList.remove('hidden');
        this.buttonHide.innerHTML = 'X';
        this.buttonHide.onclick = this.hide.bind(this);
        console.log(this.activeInterview);
//        if(this.activeInterview){
            this.activeInterview.hide();
//        }
    }
    drawControl(targetItem,e){
        let rect = targetItem.getBoundingClientRect();
        this.editGroupButtons.style.top = rect.y + 'px';
        this.targetItem = targetItem;
    }

}
