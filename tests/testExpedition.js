import Expedition from 'Expedition.js';

function testConstructor(){
  let ws = new WebSocket();
  let ex = new Expedition('title1', wsClient);
  console.assert(ex.getTitle() === 'title1', 'Title test');
  console.assert(ex.getWsClient() === ws, 'ws clients differs');
}
testConstructor();