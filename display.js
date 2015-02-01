Display = {};

Display.config = {
}
var meter = new FPSMeter($('.fps-meter')[0]);

var pixelSize = 8;
var pixelSpacing = 0;
var pixelColor = '#1596CC';

var screenHeight = innerHeight * 0.42;
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

var naiveSeconds = 0;
function animate() {
    meter.tickStart();
    
    naiveSeconds++;
    //randomizeAllPixels(0);
    //colorCenterPixel();
    randomizeAllPixels(1);
    drawImage(canvasImages[3],Math.floor(resolution.x / 2), Math.floor(resolution.y / 2));
    //drawImage(canvasImages[Math.floor(Math.random() * 3)], Math.floor(Math.random() * resolution.x), Math.floor(Math.random() * resolution.y));
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
    canvas.height = pxHeight;
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

var stars = new Array(50);
function preloadSpace() {
    for (var i = 0; i < stars.length; i++) {
        var randomX = Math.floor(Math.random() * resolution.x);
        var randomY = Math.floor(Math.random() * (resolution.y - 4));
        console.log(pixelCoordToPixel(randomX, randomY));
        stars[i] = pixelCoordToPixel(randomX, randomY);
    }   
}

function drawSpace() {
    // draw spaces
    for (var i = 0; i < pixels.length; i++) {
        pixels[i].setColor(0, 0, 0, 255);
    }
    
    //draw stars
    for (var i = 0; i < stars.length; i++) {
        var thisPixel = stars[i];
        thisPixel.setColor(255, 255, 255, 255);
    }
}


var gradientOffset = 1;
var gradientThickness = 12;
var gradientColors = 2;
var gradientStart = hexToRgb('#afdcef');
var gradientEnd = hexToRgb('#79c9ea');
var gradient = new Array(gradientColors);
for (var i = 0; i < gradientColors; i++) {
    gradient[i] = getGradientColor(gradientStart, gradientEnd, 100 * i / (gradientColors - 1));
}

var gradientTimeOffset = 0;
function drawGradient(time) {
    var curGradientOffset = 0;
    gradientTimeOffset += (time % 4 ? 0 : 1);
    
    for (var y = 0; y < resolution.y; y++) {
        for (var x = 0; x < resolution.x; x++) {
            var thisPixel = pixelCoordToPixel(x, y);
            var gradientIndex = Math.floor((x + curGradientOffset + gradientTimeOffset) / gradientThickness) % gradientColors;
            var thisColor = gradient[gradientIndex];
            thisPixel.setColor(thisColor.r, thisColor.g, thisColor.b, 255);
        }
        if (y % 3 == 0) {
            curGradientOffset++;
        }
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

var hasRandomized = false;
function randomizeAllPixels(type) {
    if (type == 0) {
        for (var i = 0; i < pixels.length; i++) {
            pixels[i].setColor(Math.random() * 255, Math.random() * 255, Math.random() * 255, 50);
        }
    } else if (type == 1) {
        for (var i = 0; i < pixels.length; i++) {
            if (Math.random() > 0.99 || !hasRandomized) {
                var grayColor = Math.random() * 255;
                pixels[i].setColor(grayColor, grayColor, grayColor, 50);
            }
        }
    }
    hasRandomized = true;
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
preloadImages(["./smiley0.gif","./smiley1.gif","./smiley2.gif","./zach.png"]).done(function(images) {
    canvasImages = new Array(images.length);
    for (var i = 0; i < images.length; i++) {
        canvasImages[i] = images[i];
    }

    initialize();
    preloadSpace();
    
    animate();
});
