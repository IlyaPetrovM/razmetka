import DescriptionBar from './DescriptionBar.js';
export default class DescriptionResult extends DescriptionBar {
    constructor(parentNode, fragment){
        super(parentNode, fragment, undefined, false);

        var __a = document.createElement('a');
        __a.href = `interview.html?id=${fragment.getInterviewId()}`;
        __a.innerHTML = `(Интервью ${fragment.getInterviewId()})`;
        __a.target = '_blank';

        var __row = this.getRow();
        for(let i in __row.children){
            try{
            __row.children[i].disabled = "true";
            }catch(e){
                console.warn(__row.children[i]);
            }
        }
        __row.appendChild(__a);
    }
}
