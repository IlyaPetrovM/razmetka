
export default class MenuFragmentControls{

    constructor(parentNode, target, fragment){
        var __fragment = fragment;
        this.iControl = document.createElement('div');
        this.iControl.id = 'iControl';
        this.iControl.style.display='block';
        this.iControl.style.left = target.style.left;
        this.counter = 0;
        var bMoveLeft = document.createElement('button');
        var bMoveRight = document.createElement('button');
        
        bMoveLeft.innerText = '<<';
        bMoveRight.innerText = '>>';
        bMoveLeft.id = 'bMoveLeft';
        bMoveRight.id = 'bMoveRight';
        
        var inputMoveStep = document.createElement('input');
        inputMoveStep.id = 'inputMoveStep';
        inputMoveStep.type='number';
        inputMoveStep.value = 1.0;
        inputMoveStep.max = 180.0;
        inputMoveStep.step = 0.1;
        inputMoveStep.min = 0.00;
        inputMoveStep.size = '3';
        this.iControl.appendChild(bMoveLeft);
        this.iControl.appendChild(bMoveRight);
        this.iControl.appendChild(inputMoveStep);
        parentNode.appendChild(this.iControl);
        
        
        bMoveLeft.onclick = function(e){
            console.log('<');
            let step_s = -parseFloat(inputMoveStep.value);
            let start_s = __fragment.getStartS()+step_s,
                end_s = __fragment.getEndS()+step_s;
            __fragment.editFragment(start_s,end_s);
        };
        bMoveRight.onclick = function(e){
            console.log('>');
            let step_s = parseFloat(inputMoveStep.value);
            let start_s = __fragment.getStartS()+step_s,
                end_s = __fragment.getEndS()+step_s;
            __fragment.editFragment(start_s,end_s);
        };
        document.addEventListener( 'fragmentChoosen', this.showMotionControl.bind(this,true) );
        document.addEventListener( 'fragmentUnchoosen', this.showMotionControl.bind(this,false) );
        
        
        var bDeleteFragment = document.createElement('button');
        bDeleteFragment.id = 'bDeleteFragment';
        bDeleteFragment.innerHTML = 'Удалить фрагменты';
        bDeleteFragment.onclick = function(e){
            if(confirm('Вы уверены, что хотите удалить выделенные фрагменты?')){
                console.log('Удаляем'); /// TODO
            }else{
                console.log('Отмена удаления');
            }
        }
        this.iControl.appendChild(bDeleteFragment);
        this.removeMe = function(){
            parentNode.removeChild(this.iControl);
        }
    }
    
     showMotionControl(show) {
        if(show){
            this.counter++; 
            this.iControl.style.display = 'block';
        }else{
            this.counter--;
            if(this.counter == 0){
                this.iControl.style.display = 'none';
            }
        }
    }
    
    sendStepToMove(right) {
        let step_s = -parseFloat(inputMoveStep.value);
        if(right){
            step_s = parseFloat(inputMoveStep.value)
        }
        var moveFragmentEvent = new CustomEvent('moveFragmentMediaEvent');
        moveFragmentEvent.step_s = parseFloat(step_s);
        console.log(moveFragmentEvent);
        document.dispatchEvent(moveFragmentEvent);
    }
}
