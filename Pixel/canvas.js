// (function () {
var canvas = document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;
var ctx = canvas.getContext('2d');

var box = [];

var stepX = 10;
var stepY = 10;

var penHeight = 5; //路径的粗细
var penColor = '#000000';


/**
 * @param  {} canvas
 * @param  {} x
 * @param  {} y
 * @description 将鼠标位置定位到canvas坐标
 */
function WindowToCanvas(canvas, x, y) {
	var box = canvas.getBoundingClientRect();
	return {
		x: x - box.left * (canvas.width / box.width),
		y: y - box.top * (canvas.height / box.height)
	};
}


for (var i = stepX + .5; i < canvas.width; i += stepX) {
	for (var j = stepY + .5; j < canvas.height; j += stepY) {
		var pixel = new Pixel({
			x: i,
			y: j,
			shape: 'rect',
			isFill: true,
			fillStyle: '#eee'
		})
		box.push(pixel);
		pixel.draw(ctx);
	}
}

// var img = new Image();
// img.src = "./img/demo.jpg";

// if (img.complete) {
// 	drawImage();
// } else {
// 	img.onload = function () {
// 		drawImage();
// 	}
// }

function drawImage() {
	var imgW = img.width,
		imgH = img.height,
		sx = canvas.width / 2 - imgW / 2,
		sy = canvas.height / 2 - imgH / 2;

	ctx.drawImage(img, sx, sy);
	var imgData = ctx.getImageData(sx, sy, imgW, imgH);
	console.log(imgData);

	for (var x = 0; x < imgData.width; x += 10) {
		for (var y = 0; y < imgData.height; y += 10) {
			var i = (y * imgData.width + x) * 4;
			if (imgData.data[i + 3] > 128 && imgData.data[i] < 100) {
				var pixel = new Pixel({
					x: x,
					y: y,
					shape: 'rect',
					isFill: true,
					fillStyle: '#000'
				})
				box.push(pixel);
				// pixel.draw(ctx);
			}
		}
	}
	refresh();
}


function refresh() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < box.length; i++) {
		var pixel = box[i];
		pixel.draw(ctx);
	}
}

var mousedown = false;
var p1, p2;

var mouseMovePoints = [];

canvas.addEventListener('mousedown', function (e) {
	mousedown = true;
	p1 = WindowToCanvas(canvas, e.clientX, e.clientY);
	for (var p = 0; p < box.length; p++) {
		var pixel = box[p];
		if (pixel.isPointInPath(ctx, p1)) {
			pixel.fillStyle = penColor;
		}
	}
	refresh();
}, false);


canvas.addEventListener('mousemove', function (e) {
	if (mousedown) {
		p2 = WindowToCanvas(canvas, e.clientX, e.clientY);
		mouseMovePoints.push(p2);
		drawColorToPixel(p1, p2, penColor);
		p1 = p2;
	}
}, false);

canvas.addEventListener('mouseup', function (e) {
	mousedown = false;

	mouseMovePoints = [];
}, false);

canvas.addEventListener('mouseout', function (e) {
	mousedown = false;
	mouseMovePoints = [];
}, false);


function drawColorToPixel(p1, p2, color) {
	box.forEach(function (pixel, index) {
		var p = {
			x: pixel.x,
			y: pixel.y
		};
		var distance = distToSegment(p, p1, p2, penHeight);
		if (distance <= penHeight) {
			var pixel = box[index];
			pixel.fillStyle = color;
		}
	});
	refresh();
}

function sqr(x) {
	return x * x
}

function dist2(p1, p2) {
	return sqr(p1.x - p2.x) + sqr(p1.y - p2.y)
}

function distToSegmentSquared(p, v, w) {
	var l2 = dist2(v, w);
	if (l2 == 0) return dist2(p, v);
	var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
	if (t < 0) return dist2(p, v);
	if (t > 1) return dist2(p, w);
	return dist2(p, {
		x: v.x + t * (w.x - v.x),
		y: v.y + t * (w.y - v.y)
	});
}

/**
 * @description 计算线段与圆是否相交
 * @param {x: num, y: num} p 圆心点
 * @param {x: num, y: num} v 线段起始点
 * @param {x: num, y: num} w 线段终点
 */
function distToSegment(p, v, w, offset) {
	var minX = Math.min(v.x, w.x) - offset;
	var maxX = Math.max(v.x, w.x) + offset;
	var minY = Math.min(v.y, w.y) - offset;
	var maxY = Math.max(v.y, w.y) + offset;

	if ((p.x < minX || p.x > maxX) && (p.y < minY || p.y > maxY)) {
		return Number.MAX_VALUE;
	}

	return Math.sqrt(distToSegmentSquared(p, v, w));
}

canvas.style.cursor = 'url(img/pen.ico),auto';

var penHeightBtn = document.getElementById('penHeight');
var penColorBtn = document.getElementById('penColor');
var eraserBtn = document.getElementById('eraser');

//添加按钮事件
penHeightBtn.addEventListener('change', function (e) {
	canvas.style.cursor = 'url(img/pen.ico),auto';
	penHeight = Number(this.value);
	penColor = penColorBtn.value;
}, false);

penHeightBtn.addEventListener('click', function (e) {
	canvas.style.cursor = 'url(img/pen.ico),auto';
	penHeight = Number(this.value);
	penColor = penColorBtn.value;
}, false);

penColorBtn.addEventListener('change', function (e) {
	penColor = this.value;
}, false);

eraserBtn.addEventListener('click', function (e) {
	canvas.style.cursor = 'url(img/eraser.ico),auto';
	penColor = '#eee';
	penHeight = Number(this.value);
}, false);

// }())