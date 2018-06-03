export default class Test{
    run(){
        document.getElementById('testlist').innerHTML+= `${this.constructor.name}: <ol id=${this.constructor.name}> `;
        for(let f in this){
            let res = this[f].call() ? 'passed' : 'fail' ;
            document.getElementById(this.constructor.name).innerHTML += `<li class=${res}> ${res} - ${f}()`;
            console.assert(res,`${this.constructor.name} ${f}`);
        }
        document.getElementById('testlist').innerHTML+='</ol>'
    }
}
