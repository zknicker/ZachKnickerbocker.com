var meter = new FPSMeter($('.fps-meter')[0]);

var pixelSize = 10;
var pixelSpacing = 0;
var pixelColor = '#1596CC';

var screenHeight = innerHeight * 0.7; //px
var screenWidth = innerWidth; //px
var xResolution = Math.ceil(screenWidth / (pixelSize + pixelSpacing));
var yResolution = Math.floor(screenHeight / (pixelSize + pixelSpacing));

var canvas = document.getElementById("can");
var context = canvas.getContext("2d");

var resolution = { 'x': xResolution, 'y': yResolution }

var canvasHeight = canvas.height = screenHeight;
var canvasWidth = canvas.width = screenWidth;

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
pixelDisplayBuffer = new Uint32Array(pixelDisplay.data.buffer);
pixelDisplayBufferLength = pixelDisplayBuffer.length;

function animate() {
    meter.tickStart();

    randomizeAllPixels();
    context.putImageData(pixelDisplay, 0, 0);

    meter.tick();
    requestAnimFrame(animate);
}

function randomizeAllPixels() {
    for (var i = 0; i < pixels.length; i++) {
        pixels[i].setColor(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
    }
}

function initialize() {
    for (i = 0; i < pixels.length; i++) {
        yRes = Math.floor(i / resolution.x);
        y = yRes * (pixelSize + pixelSpacing);
        x = (i % resolution.x) * (pixelSize + pixelSpacing);
        pixels[i] = new Pixel(i, x, y);

        if (yRes == resolution.y - 4) {
            pixels[i].setBorderPixel(.90);
        }

        if (yRes == resolution.y - 3) {
            pixels[i].setBorderPixel(.70);
        }

        if (yRes == resolution.y - 2) {
            pixels[i].setBorderPixel(.30);
        }

        if (yRes == resolution.y - 1) {
            pixels[i].setBorderPixel(.10);
        }
    }
}

initialize();
animate();
