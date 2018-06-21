    /**************
 InterviewChooser
 ******************/
//import Interview from '../Interview.js';
import InterviewLink from './InterviewLink.js';
import IDbTable from '../IDbTable.js';
import Subscriber from '../Subscriber.js';

export default class InterviewChooser extends Subscriber{
    constructor(wsocket, parentNode, expedition){
        super();
        var __div = document.createElement('div');
        var iAmCreator = false;
        var __expedition = expedition;
        this.onUpdate = function(ex){
            document.title = ex.getTitle();
            for(let i in ex.getInterviews()){
                let itw = ex.getInterviews()[i];
                if(this.interviewItems[itw.getId()] === undefined){
                    let itwLink = new InterviewLink(itw, __div);
                    itw.addSubscriber(itwLink);
                    this.interviewItems[itw.getId()] = itwLink;
                    if(iAmCreator){
                        iAmCreator = false;
                        window.open("interview.html?id=" + itw.getId() + '&new=1',"_self");
                        //FIXME id интервью используется неправильный
                    }
                }
            }
//            for(let i in this.interviewItems){
//                if(ex.getInterviews()[i] === undefined){
//                    delete this.interviewItems[i];
//                }
//            }
        }

        __div.id = 'interviewChooser';
        this.buttonAdd = document.createElement('button');
        this.buttonAdd.innerHTML = 'Добавить интервью';
        this.buttonAdd.id = 'createInterviewButton';
        this.create = function(){
            iAmCreator = true;
            __expedition.addInterview('',new Date(), '','','');
        }
        this.buttonAdd.onclick = this.create.bind(this);
        ///FIXME
        
        this.interviewItems = {};
        

        
        parentNode.appendChild(this.buttonAdd);
        parentNode.appendChild(__div);
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


}
