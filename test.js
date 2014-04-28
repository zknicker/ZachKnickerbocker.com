var meter = new FPSMeter($('.fps-meter')[0]);

var pixelSize = 10;
var pixelSpacing = 0;
var pixelColor = '#1596CC';

var screenHeight = innerHeight * 1; //px
var screenWidth = innerWidth; //px
var xResolution = Math.ceil(screenWidth / (pixelSize + pixelSpacing));
var yResolution = Math.ceil(screenHeight / (pixelSize + pixelSpacing));

var canvas = document.getElementById("can");
var context = canvas.getContext("2d");

var resolution = { 'x': xResolution, 'y': yResolution }

canvas.height = screenHeight;
canvas.width = screenWidth;

var pixels = new Array(resolution.x * resolution.y);

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

pixelDisplay = context.getImageData(0, 0, canvas.width, canvas.height);
displayData = pixelDisplay.data;
pixelDisplayBuffer = new Uint32Array(pixelDisplay.data.buffer);

function Pixel(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y * resolution.x * pixelSize;
    this.xBound = this.x + (pixelSize);
    this.yBound = this.y + pixelSize * (resolution.x * pixelSize);
}

anim = 0;
Pixel.prototype.draw = function() {
    anim += 0.1;
    var colors = { 'r': Math.random() * 255, 'g': Math.random() * 255, 'b': Math.random() * 255 }
    
    for (var yy = this.y; yy <= this.yBound; yy += (resolution.x * pixelSize)) {
        for (var xx = this.x; xx < this.xBound; xx++) {

            var i = yy + xx;
            pixelDisplayBuffer[i] = 
                (255 << 24)         | // alpha channel
                (colors.r << 16)    | // blue channel
                (colors.g << 8)     | // green channel
                (colors.b);           // red channel
        }
    }
}

function animate() {
    meter.tickStart();
  
    for (var i = 0; i < pixels.length; i++) {
        pixels[i].draw();
    }
    context.putImageData(pixelDisplay, 0, 0);

    meter.tick();
    requestAnimFrame(animate);
}

for (i = 0; i < pixels.length; i++) {
  y = Math.floor(i / resolution.x) * (pixelSize + pixelSpacing);
  x = (i % resolution.x) * (pixelSize + pixelSpacing);
  pixels[i] = new Pixel(i, x, y);
}

animate();