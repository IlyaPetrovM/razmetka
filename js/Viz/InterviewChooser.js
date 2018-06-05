/**************
 InterviewChooser
 ******************/
//import Interview from '../Interview.js';
import InterviewLink from './InterviewLink.js';
import IDbTable from '../IDbTable.js';
import Subscriber from '../Subscriber.js';

export default class InterviewChooser extends Subscriber{
    constructor(wsocket,parentNode,expedition){
        super();
        var iAmCreator = false;
        var __expedition = expedition;
        this.onUpdate = function(ex){
            document.title = ex.getTitle();
            for(let i in ex.getInterviews()){
//                console.log(ex.getInterviews()[i]);
                if(this.interviewItems[ex.getInterviews()[i].getId()] === undefined){
                    let itwLink = new InterviewLink(ex.getInterviews()[i],this);
                    ex.getInterviews()[i].addSubscriber(itwLink);
                    this.interviewItems[ex.getInterviews()[i].getId()] = itwLink;
                }
                if(iAmCreator){
                    iAmCreator = false;
                    window.open("interview.html?id="+ex.getInterviews()[i].getId()+'&new=1',"_self");
                }
            }
//            for(let i in this.interviewItems){
//                if(ex.getInterviews()[i] === undefined){
//                    delete this.interviewItems[i];
//                }
//            }
        }
        this.div = document.createElement('div');
        this.div.id = 'interviewChooser';
        this.buttonAdd = document.createElement('button');
        this.buttonAdd.innerHTML = 'Добавить интервью';
        this.buttonAdd.id = 'createInterviewButton';
        this.create = function(){
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
                iAmCreator = true;
                __expedition.addInterview(title_,date_);
    //            super.create({title: title_,_date:date_}, 'Interview');
            }
        }
        this.buttonAdd.onclick = this.create.bind(this);
        this.div.appendChild(this.buttonAdd);
        
        
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
        this.update = function(id,data,onClickEvent){
            this.interviewItems[this.targetItem._id].editInterview();
        }
        this.buttonEdit.onclick = this.update.bind(this);
        this.remove = function(_id,onClickEvent){
        //TODO 09.04.2018
        console.log(_id);
        let id = this.targetItem._id;
        let res = confirm('Вы уверены, что хотите удалить интервью?');
        if(res){
           __expedition.removeInterview(id);
        }
    }
        this.buttonDel.onclick = this.remove.bind(this); // Чтобы передавать как параметр только один выбранный элемент
        
        this.editGroupButtons.appendChild(this.buttonEdit);
        this.editGroupButtons.appendChild(this.buttonDel);
        this.div.appendChild(this.editGroupButtons);
        parentNode.appendChild(this.div);
        this.parentNode = parentNode;
        
//        this.wsClient.onopen = this.load.bind(this);  
    }
//    createInterview(data) {
////        var inter = new Interview(data.title, data._date, this.wsClient,data.id);
////        this.interviewItems[data.id] = new InterviewLink(inter,this);
////        inter.ondelete = function(id){
////            this.div.removeChild(this.interviewItems[id].a);
////            delete this.interviewItems[id];
////            console.log('delete ',this.interviewItems[id]);
////        }.bind(this);
//    }

//    processLoad(msg) {
//        for(let i in msg.result){
//            let data = msg.result[i];
//            this.createInterview(data);
//        }
//    }
    

    
    processUpdate(msg){
        throw Error('process update chooser');
        console.log('pass');
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
