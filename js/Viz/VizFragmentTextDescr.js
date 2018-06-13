import Subscriber from '../Subscriber';
export default class VizFragmentTextDescr extends Subscriber{
    constructor(parentNode,fragment,sausage){
        super();
        var __fragment = fragment;

        this.textDescr = document.createElement('div');
        this.textDescr.setAttribute('contenteditable',true); 
        /// TODO !!!!! Нужно каким-то образом вызывать метод изменения описания фрагмента!!!!!! 2018.06.13 2:22
        this.textDescr.setAttribute('tabindex','-1'); 

        this.textDescr.id = ('textDiscr');
        this.textDescr.className = 'textDescr';
        this.textDescr.innerHTML = data.getDescr();
        this.textDescr.addEventListener('keyup', function(e){
//            console.log(e);
            __fragment.setDescr(this.textDescr.innerHTML);
            this.textDescr.innerHTML='';
        }.bind(this));
        
        this.ivlDescr = document.createElement('div');
        this.ivlDescr.className = 'ivlDescr';        
        this.ivlDescr.addEventListener('mouseover',this.scrollTo.bind(this.viz));
        this.ivlDescr.addEventListener('mouseleave',this.scrollTo.bind(this.viz));
var __start = new TimeField(this.ivlDescr,__fragment,__fragment.getStartS),
            __end = new TimeField(this.ivlDescr,__fragment,__fragment.getEndS);
        __fragment.addSubscriber(__start);
        __fragment.addSubscriber(__end);
        __start.onChange = function(time_s){
            __fragment.setStartS(time_s);
        }
        __end.onChange = function(time_s){
            __fragment.setEndS(time_s);
        }

        this.ivlDescr.appendChild(this.textDescr);
        
        parentNode.appendChild(this.ivlDescr);
    }
}