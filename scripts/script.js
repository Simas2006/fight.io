var ZOOM_SIZE = 50; // dependent on server
var VISIBLE_SIZE = 40;
var PLAYER_SIZE = 25;
var loadedImages = {};
var active = {
  players: [[100,100,"player1","#f00"],[90,90,"player2","#00f"]],
  powerups: [[100,120,"speed"]],
  inventory: [["speed",4],["health",3],["test",2]],
  health: 100
};

function renderAll(playerData,powerupData,inventoryData) {
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
  // render powerups
  var loadedCount = 0;
  for ( var i = 0; i < powerupData.length; i++ ) {
    var dx = powerupData[i][0] - playerData[0][0];
    var dy = (powerupData[i][1] - 1) - playerData[0][1];
    if ( dx > VISIBLE_SIZE || dy > VISIBLE_SIZE ) continue;
    dx *= size / ZOOM_SIZE;
    dy *= size / ZOOM_SIZE;
    dx += size / 2;
    dy += size / 2;
    getImage("/imageassets/powerup_" + powerupData[i][2] + ".png",function(img) {
      ctx.drawImage(img,dx,dy);
      loadedCount++;
    });
  }
  var interval = setInterval(function() {
    if ( loadedCount >= powerupData.length ) {
      clearInterval(interval);
      // render inventory
      var loadedCount = 0;
      ctx.strokeStyle = "#ffffff";
      ctx.font = "30px Arial";
      ctx.fillStyle = "#000000";
      for ( var i = 0; i < 10; i++ ) {
        var dy = (i * ZOOM_SIZE) + (size - 10 * ZOOM_SIZE) - 2;
        ctx.fillRect(0,dy,ZOOM_SIZE,ZOOM_SIZE);
        ctx.strokeRect(0,dy,ZOOM_SIZE,ZOOM_SIZE);
        if ( inventoryData[i] ) {
          getImage("/imageassets/powerup_" + inventoryData[i][0] + ".png",[dy,inventoryData[i][1]],function(img,value) {
            ctx.drawImage(img,2,value[0] + 2);
            ctx.fillText(value[1],16,value[0] + 35);
            loadedCount++;
          });
        }
      }
      
    }
  },100);
}

function getImage(url,secure,callback) {
  if ( ! callback ) {
    callback = secure;
    secure = null;
  }
  if ( loadedImages[url] ) {
    callback(loadedImages[url],secure);
  } else {
    var img = new Image();
    img.src = url;
    img.onload = function() {
      loadedImages[url] = img;
      callback(img,secure);
    }
  }
}

window.onload = function() {
  renderAll(active.players,active.powerups,active.inventory);
}
