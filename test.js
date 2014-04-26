var meter = new FPSMeter($('.fps-meter')[0]);

var pixelSize = 10;
var pixelSpacing = 0;
var pixelColor = '#1596CC';

var screenHeight = innerHeight * 1; //px
var screenWidth = innerWidth; //px
var xResolution = Math.ceil(screenWidth / (pixelSize + pixelSpacing));
var yResolution = Math.ceil(screenHeight / (pixelSize + pixelSpacing));

var PI = Math.PI;

var canvas = document.getElementById("can");
var c = canvas.getContext("2d");

var resolution = { 'x': xResolution, 'y': yResolution }

canvas.height = screenHeight;
canvas.width = screenWidth;

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

pixelSources = new Array(256);
for (var p = 0; p < pixelSources.length; p++) {
    var pixelSource = c.createImageData(pixelSize, pixelSize);
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    for (var i = 0; i < pixelSource.data.length; i += 4) {
        pixelSource.data[i + 0] = r;
        pixelSource.data[i + 1] = g;
        pixelSource.data[i + 2] = b;
        pixelSource.data[i + 3] = 255;
    }
    pixelSources[p] = pixelSource;
}

function Pixel(id, x, y) {
  this.x = x;
  this.y = y;
}
    var pixelShape = c.createImageData(pixelSize, pixelSize); // only do this once per page
    var pixelShapeData  = pixelShape.data;                        // only do this once per page

Pixel.prototype.draw = function() {
    randomPixelSource = Math.floor(Math.random() * pixelSources.length);
    c.putImageData(pixelSources[randomPixelSource], this.x, this.y);  
  //c.fillRect(this.x, this.y, pixelSize, pixelSize);
}

function animate() {
  meter.tickStart();
  
  //c.fillStyle = "#333";
  //c.fillRect(x,y,cWidth,cHeight);

  for (var i = 0; i < pixels.length; i++) {
    if (Math.random() < 1) {
        //c.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
        pixels[i].draw();
    }
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