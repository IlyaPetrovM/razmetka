import Subscriber from '../Subscriber.js' 
export default class InterviewLink extends Subscriber{
    constructor(inte, parentNode){
        super();
        if(inte===undefined) throw TypeError('interview is undefined');
        var __a = document.createElement('a');
        __a.className = 'interviewLink';
        __a.href = '#';
        var __interview = inte;
        var __parentNode = parentNode;
        
        __a._id = inte.id;
       
        updateLink();
        __parentNode.div.appendChild(__a); 
        __a.onmouseover = __parentNode.drawControl.bind(__parentNode,__a);
        __a.href = `interview.html?id=${__interview.getId()}`;

        this.onUpdate = function(iw){
            updateLink();
        }
        
        this.onPublisherRemove = function(){
            console.log('remove Itw Link');
            __a.parentElement.removeChild(__a);
        }
        
        this.editInterview = function(){
            let _data = {};
            for(let key in __interview.data){
                if(key !== 'id' && key !== 'tracks'){
                    let val = prompt(`${key}`, __interview[key]);
                    if(val){
                            _data[key] = val; 
                    }
                }
            }
            __interview.editInterview(_data);
        }
        
        /* private methods */
        function updateLink () {
            let d = new Date(__interview.getDate());
            let month = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(d.getMonth()+1);
            let day = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(d.getDate());
            __a.innerHTML =`${__interview.getId()} ${d.getFullYear()}-${month}-${day} ${__interview.getTitle()}`;
        }
    }    
}
