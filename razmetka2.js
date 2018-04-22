/******************

    source: https://github.com/IlyaPetrovM/razmetka

********************/

"use strict";
import InterviewChooser from './InterviewChooser.js';
var wsClient = new WebSocket('ws://localhost:8081');
wsClient.onerror = function(err){
    alert('Ошибка подключения, попробуйте перезагрузить страницу');
}

var body = document.getElementsByTagName("body")[0];
var ic = new InterviewChooser(wsClient,body);