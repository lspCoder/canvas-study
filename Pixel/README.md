---
title: canvas像素画板
date: 2018-11-04 15:30:35
tags:
- canvas
- javascript
comments: true
github: 'https://github.com/lspCoder/canvas-study.git'
---

最近项目上要实现一个类似像素风格的画板，可以像素小格子可以擦除，框选变色，可以擦出各种图形，这样一个小项目看似简单，包含的东西还真不少。

#### 绘制像素格子
我们先定义像素格子类

```javascript
Pixel = function (option) {
    this.x = option.x;
    this.y = option.y;
    this.shape = option.shape;
    this.size = option.size || 8;
}
```

x和y表示中心点坐标，一开始我是这么做的，先定义路径<!--more-->

```javascript
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
```

像素网格支持圆形和矩形，路径定义好后，然后进行绘制

```javascript
draw: function (ctx) {
			ctx.save();
			ctx.lineWidth=this.lineWidth;
			ctx.strokeStyle=this.strokeStyle;
			ctx.fillStyle=this.fillStyle;
			ctx.beginPath();
			this.createPath(ctx);
			ctx.stroke();
			if(this.isFill){ctx.fill();}
			ctx.restore();
		}
```

然后通过循环批量创建像素网格：

```javascript
for (var i = stepX + .5; i < canvas.width; i+=stepX) {
		for (var j = stepY + .5; j < canvas.height; j+=stepY) {
			var pixel = new Pixel({
				x: i,
				y: j,
				shape: 'circle'
			})
			box.push(pixel);
			pixel.draw(ctx);
		}
	}
```

这样做看似完美，然而有一个巨大毙命，每画一个像素都回绘制到上下文中，每一次都在改变canvas的状态，这样做会导致渲染性能太差，因为像素点很多，如果画布比较大，性能很是令人堪忧，并且画板上面还有一些操作，如此频繁改变canvas的状态是不合适的。

![](https://i.loli.net/2018/11/04/5bdeaf1e0d5d3.png)

因此，正确的做法是：我们应该定义好所有的路径，最好在一次性的批量绘制到canvas中；

```javascript
//定义像素的位置
for (var i = stepX + .5; i < canvas.width; i+=stepX) {
		for (var j = stepY + .5; j < canvas.height; j+=stepY) {
			var pixel = new Pixel({
				x: i,
				y: j,
				shape: 'circle'
			})
			box.push(pixel);
		}
	}

//批量绘制
	console.time('time');
	ctx.beginPath();
	for (var c = 0; c < box.length; c++) {
		var circle = box[c];
		ctx.moveTo(circle.x + 3, circle.y);
		circle.createPath(ctx);
	}
	ctx.closePath();
	ctx.stroke();
	
	console.timeEnd('time');
```

![](https://i.loli.net/2018/11/04/5bdeb029baf99.png)

可以看到这个渲染效率很快，尽可能少的改变canvas的状态，因为每改变一次上下文的状态，canvas都会重新绘制，这种状态是全局的状态。

#### 像素网格交互

项目的需求是，在画布上鼠标按下移动，可以擦除像素点，这里面包含两个知识点，一个是如何获取鼠标移动路径上的像素网格，二是性能问题，因为我们这个需求的要求是绘制八万个点，不说别的，光是循环都得几十上百毫秒，何况还要绘制渲染。我们先来看第一个问题：

##### 获取鼠标移动路径下的网格

看到这个问题，我们很容易想到，写个函数，通过鼠标的位置获取下所在的位置包含那个网格，然后每次移动都重新更新位置计算，这样看是可以完成需求，但是如果鼠标移动过快，是无法做到，每个点的位置都可以计算到的，效果会不连贯。我们换种思路，鼠标经过的路径，我们可以很明确的知道起始和终点，我们把整个绘制路径想象成一段段的线段，那么问题就变成，线段与原相交的一个算法了，线段就是画笔的粗细，线段经过的路径就是鼠标运动的路径，与之相交的圆就是需要变化样式的网格。转换成代码就是如下：

```javascript
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
```

具体逻辑就不详述，各位看官可以自行看代码。然后通过获取到的相交网格的，然后删除box里面的数据，重新render一遍，就可以看到效果了。

![](https://i.loli.net/2018/11/10/5be68f49a72b5.gif)

同样的道理，我们可以做成染色效果，那么我们就可能实现一个canvas像素画板的小demo了。不过做成染色效果就必须使用第一种绘制方法了，每个像素必须是一个对象，因为每个对象的状态是独立的，不过这个不用担心性能，像素点不多，基本不会有卡顿感。实现效果大体如下：

![](https://i.loli.net/2018/11/10/5be6ac6860fb3.gif)

最近又有点懒，先这样了，后面有时间添加一个上传图片，图片像素画的功能和导出功能。




博客地址:https://lspcoder.github.io/