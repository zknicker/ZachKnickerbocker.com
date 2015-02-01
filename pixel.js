/* Representation of a pixel of a given size on the display. */
function Pixel(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y * canvasWidth;
    this.xBound = this.x + pixelSize;
    this.yBound = this.y + pixelSize * (canvasWidth - 1);
    this.isBorderPixel = false;
    this.color = {r: 255, g: 255, b: 255};
}

/* Set the color of the pixel. r, g, b, a values are 0 - 255. */
Pixel.prototype.setColor = function(r, g, b, a) {
    if (!this.isBorderPixel) {
        for (var y = this.y; y <= this.yBound; y += (canvasWidth)) {
            for (var x = this.x; x < this.xBound; x++) {

                var i = y + x;
                if (x < canvasWidth && i < pixelDisplayBufferLength) {
                    pixelDisplayBuffer[i] =
                        (a << 24) |
                        (b << 16) |
                        (g << 8)  |
                        (r);
                }
            }
        }
    }
    this.color.r = r;
    this.color.g = g;
    this.color.b = b;
}

Pixel.prototype.getColor = function() {
    return this.color;
}

Pixel.prototype.setBorderPixel = function(chance) {
    if (Math.random() > chance) this.isBorderPixel = true;
}
