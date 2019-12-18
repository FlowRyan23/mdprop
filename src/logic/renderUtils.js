CanvasRenderingContext2D.prototype.fillPoly = function (points, fillColor, strokeColor) {
    var i = points.length;
    if (!i) return;

    this.beginPath();
    this.moveTo(points[0][0], points[0][1]);
    while (i--) this.lineTo(points[i][0], points[i][1]);
    this.closePath();

    if (strokeColor) {
        this.strokeStyle = strokeColor;
        this.stroke();
    }

    if (fillColor) {
        this.fillStyle = fillColor;
        this.fill();
    }
};

CanvasRenderingContext2D.prototype.drawText = function (text, x, y, color, size=12, font="Arial", align="center") {
	this.fillStyle = color;
	this.textAlign = align;
	this.font = size + "px " + font;
	this.fillText(text, x, y + size/2);
};