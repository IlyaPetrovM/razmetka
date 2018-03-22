

(function(exports){
exports.Act = class {
    constructor(){
        this.CREATE = "CRE";
        this.LOAD = "LOA";
        this.UPDATE = "UPD";
        this.DELETE = "DEL";
        this.ERROR = "ERR";
    }
};
})(typeof exports === 'undefined' ? this['exports']={} : exports);