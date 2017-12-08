var ZOOM_SIZE = 50; // dependent on server
var VISIBLE_SIZE = 40;
var PLAYER_SIZE = 25;
var active = {
  players: [],
  powerups: [],
  inventory: ["speed","speed","speed","health","health","test","test"],
  health: 100
};

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
  // render players
  for ( var i = 0; i < playerData.length; i++ ) {
    var dx = playerData[i][0] - playerData[0][0];
    var dy = playerData[i][1] - playerData[0][1];
    if ( dx > VISIBLE_SIZE || dy > VISIBLE_SIZE ) continue;
    dx *= size / ZOOM_SIZE;
    dy *= size / ZOOM_SIZE;
    dx += size / 2;
    dy += size / 2;
    ctx.fillStyle = playerData[i][3];
    ctx.beginPath();
    ctx.arc(dx,dy,PLAYER_SIZE,0,Math.PI * 2,false);
    ctx.fill();
    ctx.closePath();
    ctx.font = "30px Arial";
    ctx.fillText(playerData[i][2],dx,dy - 40);
  }
  // render sidebar
  ctx.strokeStyle = "#ffffff";
  for ( var i = 0; i < 10; i++ ) {
    if ( i == 0 ) ctx.fillStyle = "#000099";
    else if ( i == 1 ) ctx.fillStyle = "#990000";
    else ctx.fillStyle = "#000000";
    var dy = (i * ZOOM_SIZE) + (size - 10 * ZOOM_SIZE);
    ctx.fillRect(0,dy,ZOOM_SIZE,ZOOM_SIZE);
    ctx.strokeRect(0,dy,ZOOM_SIZE,ZOOM_SIZE);

  }
  // render powerups (has to be last because loading)
  for ( var i = 0; i < powerupData.length; i++ ) {
    var dx = powerupData[i][0] - playerData[0][0];
    var dy = (powerupData[i][1] - 1) - playerData[0][1];
    if ( dx > VISIBLE_SIZE || dy > VISIBLE_SIZE ) continue;
    dx *= size / ZOOM_SIZE;
    dy *= size / ZOOM_SIZE;
    dx += size / 2;
    dy += size / 2;
    var img = new Image();
    img.src = "/imageassets/powerup_" + powerupData[i][2] + ".png";
    img.onload = function() {
      ctx.drawImage(img,dx,dy);
    }
  }
}

window.onload = function() {
  renderAll([[100,100,"player1","#f00"],[90,90,"player2","#00f"]],[[100,120,"speed"]]);
}
