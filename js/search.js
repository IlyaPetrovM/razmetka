"use strict";

import IDbTable from './IDbTable.js';
import FragmentText from './FragmentText.js';
import DescriptionResult from './Viz/DescriptionResult.js';
const Act = new exports.Act();

import Expedition from './Expedition.js';
import InterviewChooser from './Viz/InterviewChooser.js';
//import IDbTable from './IDbTable.js';

//var wsClient = new WebSocket(`ws://${window.location.hostname}:8081`);
//wsClient.onerror = function(err){
//    alert('Ошибка подключения, попробуйте перезагрузить страницу');
//}
//var dbClient = new IDbTable(wsClient);


export default class Search {
    constructor(parentNode, ws){
        var __dbClient = new IDbTable(ws);

        var ex = new Expedition('Экспедиция в деревню',__dbClient);

        var __interviewBar = document.createElement('div');

        var ic = new InterviewChooser(ws,__interviewBar,ex);
        ex.addSubscriber(ic);
        ex.loadInterviews();

        var __input = document.createElement('input');
        __input.type = 'search';
        __input.placeholder = 'Поиск';

        parentNode.appendChild(__input);
        var __result = document.createElement('div');
        parentNode.appendChild(__result);

        var fragments = {};
        var vizfragments = {};
        var err = document.createElement('div');
        err.classList.add('hidden');
        err.setQuery = function(q){
            err.innerHTML = `По запросу "<code>${q}</code>" ничего не удалось найти. <br>
                                            Попробуйте поменять запрос. Используйте меньше слов. Удалите пунктуацию.`;
        };
        __result.appendChild(err);
        __result.appendChild(__interviewBar);
        this.getResult = function(msg){
            if(msg.data.length<=0){
                err.setQuery(__input.value);
//                __result.classList.add('hidden');
                err.classList.remove('hidden');
                __interviewBar.classList.remove('hidden');
            }else{
//                __result.classList.remove('hidden');
                err.classList.add('hidden');
                __interviewBar.classList.add('hidden');
            }
            for(let j in vizfragments){
                let found = false;
                for(let k in msg.data){
                    if(j == msg.data[k].id){
                        found = true;
                    }
                }
                if(!found){
                    vizfragments[j].onPublisherRemove();
                    delete vizfragments[j];
//                    delete fragments[j];
                }
            }
            for(let i in msg.data){
                let f = msg.data[i];
                if(fragments[f.id] === undefined){
                    fragments[f.id] = new FragmentText(f.id,
                                              f.start_s,
                                              f.end_s,
                                              f.track_id,
                                              f.int_id,
                                              __dbClient,
                                              f.descr,
                                              f.media_id);
                }
                if(vizfragments[f.id] === undefined){
                    vizfragments[f.id] = new DescriptionResult(__result, fragments[f.id]);
                    fragments[f.id].update(fragments[f.id]);
                }
            }
           __result.style.cssText = `overflow-y: scroll; height:${window.innerHeight-30}px`;
        }

        this.search = function(text){
            if(text=='') return;
            text = '%' + text + '%';
            let query = '';
            let concretePhraseOn = false;
            for(let i in text){
                console.log(i);
                if(text[i]==='"'){
                    if(concretePhraseOn){
                        concretePhraseOn=false;
                    }else{
                        concretePhraseOn = true;
                    }
                }
                if(concretePhraseOn){
                    query += text[i];
                }else{
                    if(text[i]===' ' || text[i]==='.' || text[i]===',' || text[i]==='!' || text[i]==='?'){
                        query += '%';
                    }else{
                        query += text[i];
                    }
                }
            }
            let sql = {
                action: Act.LOAD,
                table: 'IntervalText',
                where: "descr LIKE '"+query+"' ORDER BY int_id"
            };
            __dbClient.send('Search', sql);
        }
        __dbClient.addSubscriber('Search', this.getResult.bind(this));

        __input.onchange = function(e){
            console.log('>>>',e.target.value);
            this.search(e.target.value);
        }.bind(this);
    }

};
var ws = new WebSocket(`ws://${window.location.hostname}:8081`);

var s = new Search(document.body,ws);
