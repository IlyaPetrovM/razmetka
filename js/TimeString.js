//class TimeString

export default class TimeString{
    constructor(){

    }
    static parseMs(str){
        if(typeof str === 'number') return str;
        let s = new String(str);
        let greaterMs = s.split('.');
        if(greaterMs.length>2 || s=='' ) return undefined;
        let ms = (parseInt(greaterMs[1]) || 0);
        let a = greaterMs[0].split(':');
        if(a.length===1 && isNaN(a[0])) return undefined;
        a.reverse();
        let hh = (parseInt(a[2]) || 0),
            mm = (parseInt(a[1]) || 0),
            ss = (parseInt(a[0]) || 0);
        let res_ms = hh*60*60*1000 + mm*60*1000 + ss*1000 + ms;
        return res_ms;
    }
    static date2yyyy_mm_dd(d){
        if(!(d instanceof Date)) throw TypeError('Incorrect type of date:', d);
        let month = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(d.getMonth()+1);
        let day = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(d.getDate());
        return `${d.getFullYear()}-${month}-${day}`;
    }
    static sec2str(val_s){
        let str;
        let s = 0;
        if(val_s > 0) s = val_s;
        let se = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(parseInt(s % 60));
            let ms = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:3}).format(parseInt((s%60)*1000)%1000);
            let mi = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(parseInt(s / 60) % 60);
            let ho = new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2}).format(parseInt(s / 360) % 24);
            str = ho+':'+mi+':'+se+'.'+ms;
        return str;
    }
}
