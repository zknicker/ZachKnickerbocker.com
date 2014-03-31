var meter = new FPSMeter($('.fps-meter')[0]);

var PI = Math.PI;

var canvas = document.getElementById("can");
var c = canvas.getContext("2d");

var resolution = { 'x': 200, 'y': 150 }
var pixelSize = 6;
var pixelColor = '#1596CC';
var pixelSpacing = 0;

canvas.width = (pixelSize + pixelSpacing) * resolution.x;
canvas.height = (pixelSize + pixelSpacing) * resolution.y;

var cWidth = canvas.width;
var cHeight = canvas.height;

var pixels = new Array(resolution.x * resolution.y);

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function Pixel(id, x, y) {
  this.x = x;
  this.y = y;
}

Pixel.prototype.draw = function() {
  c.fillRect(this.x, this.y, pixelSize, pixelSize);
}

function animate() {
  meter.tickStart();
  
  c.fillStyle = "#333";
  c.fillRect(x,y,cWidth,cHeight);

  c.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
  for (i = 0; i < pixels.length; i++) {
    if (Math.random() < Math.random()) 
    pixels[i].draw();
  }

  meter.tick();
  requestAnimFrame(animate);
}

for (i = 0; i < pixels.length; i++) {
  y = Math.floor(i / resolution.x) * (pixelSize + pixelSpacing);
  x = (i % resolution.x) * (pixelSize + pixelSpacing);
  pixels[i] = new Pixel(i, x, y);
}

animate();