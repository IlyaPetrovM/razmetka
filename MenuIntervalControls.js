
export default class MenuIntervalControls{

    constructor(parentNode){
        this.iControl = document.createElement('div');
        this.iControl.id = 'iControl';
        this.iControl.style.display='none';
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
        this.iControl.appendChild(bMoveLeft);
        this.iControl.appendChild(bMoveRight);
        this.iControl.appendChild(inputMoveStep);
        parentNode.appendChild(this.iControl);
        
        
        bMoveLeft.onclick = this.sendStepToMove.bind( this,  false);
        bMoveRight.onclick = this.sendStepToMove.bind( this, true );
        document.addEventListener( 'intervalChoosen', this.showMotionControl.bind(this,true) );
        document.addEventListener( 'intervalUnchoosen', this.showMotionControl.bind(this,false) );
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
        var moveIntervalEvent = new CustomEvent('moveIntervalMediaEvent');
        moveIntervalEvent.step_s = parseFloat(step_s);
        console.log(moveIntervalEvent);
        document.dispatchEvent(moveIntervalEvent);
    }
}