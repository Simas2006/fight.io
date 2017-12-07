var ZOOM_SIZE = 60; // dependent on server
var VISIBLE_SIZE = 40;

function renderAll(playerData,powerupData) {
  var canvas = document.getElementById("canvas");
  var size = Math.min(window.innerWidth,window.innerHeight)
  canvas.width = size;
  canvas.height = size;
  var ctx = canvas.getContext("2d");
  // render graph
  ctx.fillStyle = "#222";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = "#777";
  for ( var i = playerData[0][0] % ZOOM_SIZE; i < size; i += ZOOM_SIZE ) {
    ctx.moveTo(0,i);
    ctx.lineTo(size,i);
    ctx.stroke();
  }
  for ( var i = playerData[0][1] % ZOOM_SIZE; i < size; i += ZOOM_SIZE ) {
    ctx.moveTo(i,0);
    ctx.lineTo(i,size);
    ctx.stroke();
  }
}

window.onload = function() {
  renderAll([[100,100,"player1","#f00"],[90,90,"player2","#00f"]]);
}
