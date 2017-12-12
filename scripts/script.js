var ZOOM_SIZE = 50; // dependent on server
var VISIBLE_SIZE = 40;
var PLAYER_SIZE = 25;
var socket = io();
var loadedImages = {};
var active = {
  players: [],
  powerups: [],
  inventory: [],
  health: 0
};

function renderAll(playerData,powerupData,inventoryData,health) {
  if ( playerData.length < 1 ) return;
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
  var interval1 = setInterval(function() {
    if ( loadedCount >= powerupData.length ) {
      clearInterval(interval1);
      // render inventory
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
      var interval2 = setInterval(function() {
        if ( loadedCount >= inventoryData.length ) {
          clearInterval(interval2);
          // render health
          ctx.fillStyle = "#000000";
          ctx.fillRect(size - ZOOM_SIZE,size - (10 * ZOOM_SIZE),ZOOM_SIZE,10 * ZOOM_SIZE);
          ctx.strokeRect(size - ZOOM_SIZE,size - (10 * ZOOM_SIZE),ZOOM_SIZE,10 * ZOOM_SIZE);
          var gradient = ctx.createLinearGradient(size - ZOOM_SIZE,size - (10 * ZOOM_SIZE),ZOOM_SIZE,10 * ZOOM_SIZE);
          gradient.addColorStop(0,"green");
          gradient.addColorStop(0.2,"yellow");
          gradient.addColorStop(0.35,"red");
          ctx.fillStyle = gradient;
          ctx.fillRect(size - ZOOM_SIZE,size - (10 * ZOOM_SIZE) + ((10 - (health / 10)) * ZOOM_SIZE),ZOOM_SIZE,ZOOM_SIZE * 10);
        }
      },100);
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
  setTimeout(function() {
    // set up active data
    socket.emit("join",location.search.slice(1));
  },500);
}

window.onkeyup = function(e) {
  var keyid = e.which || e.keyCode;
}
