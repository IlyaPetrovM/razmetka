/******************

    source: https://github.com/IlyaPetrovM/razmetka

********************/

"use strict";
import Expedition from './Expedition.js';
import InterviewChooser from './Viz/InterviewChooser.js';
import IDbTable from './IDbTable.js';

var wsClient = new WebSocket('ws://localhost:8081');
//wsClient.onerror = function(err){
//    alert('Ошибка подключения, попробуйте перезагрузить страницу');
//}
var dbClient = new IDbTable(wsClient);
var ex = new Expedition('Экспедиция в деревню',dbClient);

var ic = new InterviewChooser(wsClient,document.body,ex);
ex.addSubscriber(ic);
ex.loadInterviews();