Display = {};

Display.config = {
}
var meter = new FPSMeter($('.fps-meter')[0]);

var pixelSize = 10;
var pixelSpacing = 0;
var pixelColor = '#1596CC';

var screenHeight = innerHeight * 0.7;
var screenWidth = innerWidth;
var xResolution = Math.ceil(screenWidth / (pixelSize + pixelSpacing));
var yResolution = Math.floor(screenHeight / (pixelSize + pixelSpacing));

var canvas = document.getElementById("can");
var context = canvas.getContext("2d");

var resolution = { 'x': xResolution, 'y': yResolution }

var canvasHeight = canvas.height = screenHeight;
var canvasWidth = canvas.width = screenWidth;

var pixels = new Array(resolution.x * resolution.y);

var canvasImageUrls = [ './smiley.gif' ];
var canvasImages;

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
    //colorCenterPixel();
    drawImage(canvasImages[Math.floor(Math.random() * 3)], Math.floor(Math.random() * resolution.x), Math.floor(Math.random() * resolution.y));
    context.putImageData(pixelDisplay, 0, 0);

    meter.tick();
    requestAnimFrame(animate);
}

function pixelCoordToPixel(x, y) {
    return pixels[y * resolution.x + x];
}

function drawImage(image, x, y) {

    // Load the image into a hidden canvas.
    var pxWidth = image.width;
    var pxHeight = image.height;
    var canvas = document.createElement('canvas');
    canvas.height = pxHeight;;
    canvas.width = pxWidth;
    var context = canvas.getContext('2d');

    context.drawImage(image, 0, 0);
    data = context.getImageData(0, 0, image.width, image.height);
    data = data.data;

    // Using the canvas, paint pixels one-by-one.
    var i = 0;
    var xPos = x; var yPos = y;
    while (i < data.length) {
        xPos = x + (i / 4) % pxWidth;
        yPos = y + Math.floor((i / 4) / pxWidth);
        pixel = pixelCoordToPixel(xPos, yPos)

        if (pixel && data[i+3] != 0) {
            pixel.setColor(data[i], data[i + 1], data[i + 2], data[i + 3]);
        }

        i += 4;
    }
}

var snakePixel = 0;
var snakeMode = 0;
var snakeThreshold = resolution.x;

function snake() {
    pixels[snakePixel].setColor(100, 200, 255, 255);
    snakeThreshold--;
    if (snakeThreshold <= 0) {
      snakeThreshold = resolution.x;
      snakePixel += resolution.x;
      snakeMode = snakeMode == 1 ? 0 : 1;
    }

    if (snakeMode == 0) {
        snakePixel++;
        if (snakePixel >= pixels.length) {
            snakePixel = 0;
        }
    } else {
        snakePixel--;
    }
}

function colorCenterPixel() {
    var xCenter = Math.floor(resolution.x / 2);
    var yCenter = Math.ceil((resolution.y - 4) / 2);

    displayPixel = pixelCoordToPixel(xCenter, yCenter);
    displayPixel.setColor(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
}

function randomizeAllPixels() {
    for (var i = 0; i < pixels.length; i++) {
        pixels[i].setColor(Math.random() * 255, Math.random() * 255, Math.random() * 255, 50);
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

// Preload images first, and then start the display.
preloadImages(["./smiley0.gif","./smiley1.gif","./smiley2.gif"]).done(function(images) {
    canvasImages = new Array(images.length);
    for (var i = 0; i < images.length; i++) {
        canvasImages[i] = images[i];
    }
    console.log(canvasImages);

    initialize();
    animate();
});
