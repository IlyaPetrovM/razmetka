export default class Test{
    run(){
        for(let f in this){
            let res = this[f].call() ? 'passed' : 'fail' ;
            document.getElementById('testlist').innerHTML += `<li class=${res}> ${this.constructor.name} - ${f}() - ${res}`;
            console.assert(res,`${this.constructor.name} ${f}`);
        }
    }
}
