(function () {
	var canvas = document.getElementById('canvas');
	canvas.width = 600;
	canvas.height = 600;
	var ctx = canvas.getContext('2d');

	var box = [];

	var stepX = 10;
	var stepY = 10;

	var pathHeight = 5; //路径的粗细

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

	
	for (var i = stepX + .5; i < canvas.width; i+=stepX) {
		for (var j = stepY + .5; j < canvas.height; j+=stepY) {
			var pixel = new Pixel({
				x: i,
				y: j,
				shape: 'rect'
			})
			box.push(pixel);
		}
	}

	render();

	var mousedown = false;
	var p1, p2;

	var mouseMovePoints = [];

	canvas.addEventListener('mousedown', function (e) {
		mousedown = true;
		p1 = WindowToCanvas(canvas, e.clientX, e.clientY);
		
	}, false);


	canvas.addEventListener('mousemove', function (e) {
		if (mousedown) {
			p2 = WindowToCanvas(canvas, e.clientX, e.clientY);
			mouseMovePoints.push(p2);
			removeByPoints(p1, p2);
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


	//一次性绘制版本
	function render () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		console.time('time');
		ctx.beginPath();
		ctx.fillStyle = '#eee';
		for (var c = 0; c < box.length; c++) {
			var circle = box[c];
			ctx.moveTo(circle.x + 3, circle.y);
			circle.createPath(ctx);
		}
		ctx.closePath();
		// ctx.stroke();
		ctx.fill();
		console.timeEnd('time');
	}

	function removeByPoints (p1, p2) {
		box.forEach(function(pixel, index) {
			var p = { x: pixel.x, y: pixel.y };
			var distance = distToSegment(p, p1, p2);
			if (distance <= pathHeight) {
				box.splice(index, 1);
			}
		});
		render();
	}

	function sqr(x) { return x * x }

    function dist2(p1, p2) { return sqr(p1.x - p2.x) + sqr(p1.y - p2.y) }

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
    function distToSegment(p, v, w) {
        var offset = pathHeight;
        var minX = Math.min(v.x, w.x) - offset;
        var maxX = Math.max(v.x, w.x) + offset;
        var minY = Math.min(v.y, w.y) - offset;
        var maxY = Math.max(v.y, w.y) + offset;

        if ((p.x < minX || p.x > maxX) && (p.y < minY || p.y > maxY)) {
            return Number.MAX_VALUE;
        }

        return Math.sqrt(distToSegmentSquared(p, v, w));
    }
	
}())