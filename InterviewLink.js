export default class InterviewLink{
    constructor(inte, intChooser){
       var a = document.createElement('a');
        a.className = 'interviewLink';
        a.href = '#';
        console.log(inte);
        this.intChooser = intChooser;
        
        a._id = inte.id;
        this.a = a;
        this.inte = inte;
       
        this.inte.onupdate = this.updateLink.bind(this);
        this.updateLink();
        this.intChooser.div.appendChild(a); 
        this.a.onmouseover = this.intChooser.drawControl.bind(this.intChooser,this.a);
        this.a.onclick = this.showInterview.bind(this);
    }
    showInterview(){
        this.intChooser.hide(this.inte);

        this.inte.show(this.intChooser.parentNode);
    }
    updateLink() {
        let d = new Date(this.inte._date);
        let month = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(d.getMonth()+1);
        let day = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(d.getDate());
        this.a.innerHTML =`${this.inte.id} ${d.getFullYear()}-${month}-${day} ${this.inte.title}`;
    }
    delete(){
        this.intChooser.div.removeChild(this.a);
    }
}
