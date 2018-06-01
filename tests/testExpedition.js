'use strict';
import Test from './Test.js';
import Expedition from '../js/Expedition.js';
export default class TestExpedition extends Test{
    constructor(){
        super();
        this.testConstructor_get_title1_returns_title1 = function(){
            let ex = new Expedition('title1', 'dbClient');
            return ex.getTitle() === 'title1';
        }
        this.testConstructor_get_title_undef_thiows_error = function(){
            try{
                let ex = new Expedition(undefined, 'dbClient');
            }catch(err){
                return err.name === 'TypeError' && err.message === 'title is undefined';
            }
            return false;
        }
        this.testConstructor_get_dbClient_undef_thiows_error = function(){
            try{
                let ex = new Expedition('title', undefined);
            }catch(err){
                return err.name === 'TypeError' && err.message === 'dbClient is undefined';
            }
            return false;
        }
        function getExpedition(){
            return new Expedition('title1', 'dbClient');
        }
        this.interviewAdded_get_data_writes_to_array_Interview = function(){
            let e = getExpedition();
            let data = {
                id:1553,
                title:"Title",
                _date:'2016-06-17'
            };
            e.interviewAdded(data);
            return e.getInterviews()[data.id].getTitle() === data.title;
        }
    }
}
new TestExpedition().run();
