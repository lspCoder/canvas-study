(function () {
	Pixel = function (option) {
		this.x = option.x;
		this.y = option.y;
		this.shape = option.shape;
		this.size = option.size || 8;
		this.fillStyle = option.fillStyle;
		this.isFill = option.isFill;
		this.strokeStyle = option.strokeStyle;
	}

	Pixel.prototype = {
		constructor: Pixel,

		setColor: function (color) {
			this.fillStyle = color;
			this.filled = true;
		},

		getPoints: function() {
			var p1 = {x: this.x - this.size / 2, y: this.y - this.size / 2};
			var p2 = {x: this.x + this.size / 2, y: this.y - this.size / 2};
			var p3 = {x: this.x + this.size / 2, y: this.y + this.size / 2};
			var p4 = {x: this.x - this.size / 2, y: this.y + this.size / 2};
			return [p1, p2, p3, p4];
		},

		createPath: function (ctx) {
			if (this.shape === 'circle') {
				this.createCircle(ctx);
			} else if (this.shape === 'rect') {
				this.createRect(ctx);
			} else {
				this.createCircle(ctx);
			}
		},

		createCircle: function (ctx) {
			var radius = this.size / 2;
			ctx.arc(this.x,this.y,radius,0,Math.PI*2);
		},

		createRect: function (ctx) {
			var points = this.getPoints();
            points.forEach(function (point, i) {
                ctx[i == 0 ? 'moveTo' : 'lineTo'](point.x, point.y);
            })
            ctx.lineTo(points[0].x, points[0].y);
		},


		draw: function (ctx) {
			ctx.save();
			ctx.lineWidth=this.lineWidth;
			ctx.strokeStyle=this.strokeStyle;
			ctx.fillStyle=this.fillStyle;
			ctx.beginPath();
			this.createPath(ctx);
			if(this.isFill){
				ctx.fill();
			} else {
				ctx.stroke();
			}
			ctx.restore();
		},

		 /**
         * @param  {Object} p {x: num, y: num}
         * @description 判断点是否在这个路径上, 构造路径利用isPointInPath判断点是否在此路径上不用绘制到canvas上
         */
        isPointInPath: function (ctx, p) {
            var isIn = false;
            ctx.save();
            ctx.beginPath();
            this.createPath(ctx);
            if (ctx.isPointInPath(p.x, p.y)) {
                isIn = true;
            }
            ctx.closePath();
            ctx.restore();
            return isIn;
        }
	}
}())