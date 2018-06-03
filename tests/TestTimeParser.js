import Test from './Test.js';
import TimeParser from '../js/TimeString.js';
export default class TestTimeParser extends Test{
    constructor(){
        super();
        this.testParseGet12_34_56_123 = function(){
            let res = TimeParser.parseMs('12:34:56.123');
            let testRes = (12*1000*60*60) + (34*1000*60) + (56*1000) + 123;
            return res === testRes;
        }
        this.testParseGet_00h00m00s00ms_returns_0 = function(){
            let res = TimeParser.parseMs('00:00:00.000');
            let testRes = 0;
            return res === testRes;
        }
        this.testParseGet00h00m00sreturns0 = function(){
            let res = TimeParser.parseMs('00:00:00');
            let testRes = 0;
            return res === testRes;
        }
        this.testParseGet_00h00m00s01ms_returns_1  = function(){
            let res = TimeParser.parseMs('00:00:00.001');
            let testRes = 1;
            return res === testRes;
        }
        this.testParseGet_00h00m01s00ms_returns_1000  = function(){
            let res = TimeParser.parseMs('00:00:01.000');
            let testRes = 1000;
            return res === testRes;
        }
        this.testParseGet_00h01m00s00ms_returns_60000  = function(){
            let res = TimeParser.parseMs('00:01:00.000');
            let testRes = 1*60*1000;
            return res === testRes;
        }
        this.testParseGet_01h00m00s00ms_returns_360000  = function(){
            let res = TimeParser.parseMs('01:00:00.000');
            let testRes = 1*60*60*1000;
            return res === testRes;
        }
        this.testParseGet_01h01m01s_returns_421000  = function(){
            let res = TimeParser.parseMs('01:01:01');
            let testRes = 1*60*60*1000 + 1*60*1000 + 1*1000;
            return res === testRes;
        }
        this.testParseGet_01m01s_returns_61000  = function(){
            let res = TimeParser.parseMs('01:01');
            let testRes = 1*60*1000 + 1*1000;
            return res === testRes;
        }
        this.testParseGet_01s_returns_1000  = function(){

            let res = TimeParser.parseMs('01');
            let testRes = 1*1000;
            return res === testRes;
        }
        this.testParseGet_01sdot_returns_1000  = function(){

            let res = TimeParser.parseMs('01.');
            let testRes = 1*1000;
            return res === testRes;
        }
        this.testParseGet_semicol01s_returns_1000  = function(){

            let res = TimeParser.parseMs(':01');
            let testRes = 1*1000;
            return res === testRes;
        }
        this.testParseGet_01s123ms_returns_1123  = function(){

            let res = TimeParser.parseMs('01.123');
            let testRes = 1*1000 + 123;
            return res === testRes;
        }
        this.testParseGet_dot123ms_returns_1123  = function(){
            let res = TimeParser.parseMs('.123');
            let testRes = 123;
            return res === testRes;
        }
        this.testParseGet_01m01s123ms_returns_61123  = function(){
            let res = TimeParser.parseMs('01:01.123');
            let testRes = 1*60*1000 + 1*1000 + 123;
            return res === testRes;
        }
        this.testParseGet_00m00s1000ms_returns_1000  = function(){
            let res = TimeParser.parseMs('00.1000');
            let testRes = 1000;
            return res === testRes;
        }
        this.testParseGet_badPunct_return_undef  = function(){
            let res = TimeParser.parseMs('00.00.000');
            let testRes = undefined;
            return res === testRes;
        }
        this.testParseGet_noSymbols_return_undef  = function(){
            let res = TimeParser.parseMs('');
            let testRes = undefined;
            return res === testRes;
        }
        this.testParseGet_asfg_return_undef  = function(){
            let res = TimeParser.parseMs('asfg');
            let testRes = undefined;
            return res === testRes;
        }
        this.testParseGet_int1234_return_1234  = function(){
            let res = TimeParser.parseMs(1234);
            let testRes = 1234;
            return res === testRes;
        }
    }
}
new TestTimeParser().run();
