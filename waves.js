var meter = new FPSMeter($('.fps-meter')[0]);

var pixelSize = 6;
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

function Pixel(id, x, y) {
  this.x = x;
  this.y = y;
}

Pixel.prototype.draw = function() {
  c.fillRect(this.x, this.y, pixelSize, pixelSize);
}

animTime = 0;

  c.fillStyle = "#FFF";
  c.fillRect(0, 0, cWidth, cHeight);
  image = c.getImageData(0, 0, cWidth, cHeight);
function animate() {
  meter.tickStart();
  
  animTime = (animTime + 0.01) % (Math.PI * 2);

  var r = Math.sin(animTime) * 255;
  var g = Math.sin(animTime) * 255;
  var b = Math.sin(animTime) * 255;

  for (i = 0; i <= 2*Math.PI; i += 0.001) {
    im = (i - animTime) % (2 * Math.PI);
    var y = ((Math.sin(im) + 1) / 2) * (cHeight * Math.cos(animTime)) + (cHeight - (cHeight * Math.cos(animTime))) / 2;
    var x = (i / (2 * Math.PI)) * cWidth;
    var index = 4 * (Math.floor(y) * cWidth + Math.floor(x));
    image.data[index] = 21;
    image.data[index + 1] = r;
    image.data[index + 2] = g;
    image.data[index + 3] = b;
  }

  c.putImageData(image, 0, 0);

  meter.tick();
  requestAnimFrame(animate);
}

for (i = 0; i < pixels.length; i++) {
  y = Math.floor(i / resolution.x) * (pixelSize + pixelSpacing);
  x = (i % resolution.x) * (pixelSize + pixelSpacing);
  pixels[i] = new Pixel(i, x, y);
}

animate();