## canvas手写辨色力小游戏

#### 前言

​	前段时间看到掘金上有个es6手写辨色了游戏，觉得很有意思，作者使用dom操作实现的游戏逻辑，感觉可以用canvas实现，效率更高，于是闲着没事，手写了一个canvas版的辨色小游戏，具体效果如下：

![](https://i.loli.net/2018/10/07/5bb9d08852610.gif)

界面写得丑，忘轻喷。。。

#### 绘制游戏格子

首先我们需要准备一张画布，

```javascript
var canvas = document.getElementById('canvas');
    if (!canvas.getContext('2d')) {
        alert('你的浏览器不支持canvas，请换个浏览器试试');
    }
    var ctx = canvas.getContext('2d');
```

然后我会定义一个Rect的方块类，这个方块需要具备位置，宽高，填充颜色几个属性，根据canvas绘制矩形的api，我们可以用以下api绘制矩形

```
fillRect(x, y, width, height)        //填充矩形
strokeRect(x, y, width, height)       //矩形描边
clearRect(x, y, width, height)       //清除画布，清除部分完全透明

rect(x, y, width, height)           //矩形路径，需要配和fill和stroke
```

但是为了后面事件监听更方便，我们这里不使用fillRect方法，我们使用绘制线段的方法moveTo和lineTo来绘制，

首先通过Rect具有一个绘制路径的函数：

```javascript
	getPoints: function () {
            var p1 = { x: this.x, y: this.y };
            var p2 = { x: this.x + this.width, y: this.y };
            var p3 = { x: this.x + this.width, y: this.y + this.height };
            var p4 = { x: this.x, y: this.y + this.height };
            this.points = [p1, p2, p3, p4];
            return this.points;
        },

        createPath: function () {
            var points = this.getPoints();
            points.forEach(function (point, i) {
                ctx[i == 0 ? 'moveTo' : 'lineTo'](point.x, point.y);
            })
            if (this.closed) {
                ctx.lineTo(this.points[0].x, this.points[0].y);
            }
        },
```

首先通过位置和宽高构造四个点，然后在通过moveTo和lineTo构造路径，路径构造好后我们需要绘制到画布上，因此还需要一个draw函数绘制：

```javascript
	draw: function () {
            ctx.save();
            ctx.fillStyle = this.fillStyle;
            ctx.beginPath();
            this.createPath();
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        },
```

方块类定义好后，我们开始定义颜色函数，颜色逻辑 [参考这篇文章](https://juejin.im/post/5ba0da47e51d450e6a2e0548)；

```javascript
/**
     * 根据关卡等级返回相应的一般颜色和特殊颜色
     * @param {number} step 关卡级别
     */
    function getColor(step) {
        // rgb 随机加减 random
        let random = Math.floor(100 / step);

        // 获取随机一般颜色，拆分三色值
        let color = randomColor(17, 255),
            m = color.match(/[\da-z]{2}/g);

        // 转化为 10 进制
        for (let i = 0; i < m.length; i++) m[i] = parseInt(m[i], 16); //rgb
        let specialColor =
            getRandomColorNumber(m[0], random) +
            getRandomColorNumber(m[1], random) +
            getRandomColorNumber(m[2], random);
        return ['#' + color, '#' + specialColor];
    }

    /**
     * 获取随机颜色相近的 rgb 三色值
     * @param {number} num 单色值
     * @param {number} random 随机加减的数值
     */
    function getRandomColorNumber(num, random) {
        let temp = Math.floor(num + (Math.random() < 0.5 ? -1 : 1) * random);
        if (temp > 255) {
            return "ff";
        } else if (temp > 16) {
            return temp.toString(16);
        } else if (temp > 0) {
            return "0" + temp.toString(16);
        } else {
            return "00";
        }
    }
	/**
     * 随机颜色
     * @param {number} min 最小值
     * @param {number} max 最大值
     */
    function randomColor(min, max) {
        var r = randomNum(min, max).toString(16);
        var g = randomNum(min, max).toString(16);
        var b = randomNum(min, max).toString(16);
        return r + g + b;
    }
```

具体逻辑参考代码，

然后我们开始new小方块，并且绘制到画布上，

```javascript
var blockWidth = ((500 / col).toFixed(2) * 500 - 1) / 500;
var randomCol = Math.floor(col * Math.random());
var randomCell = Math.floor(col * Math.random());

var colorObj = getColor(step);

for (var i = 0; i < col ; i++) {
    for (var j = 0; j < col; j++) {
        var rect = new Rect({
            x: (blockWidth + 5) * i + (canvas.width - blockWidth * col - (col - 1) * 5) / 2,
            y: (blockWidth + 5) * j + (canvas.width - blockWidth * col - (col - 1) * 5) / 2,
            width: blockWidth,
            height: blockWidth,
            fillStyle: colorObj[0]
        });

        if (i == randomCol && j == randomCell) {
            rect.updateStyle(colorObj[1]);
        }

        rect.draw();
        datas.push(rect);
    }
}
```

这样我们基本就完成了游戏的大概了。

![](https://i.loli.net/2018/10/07/5bb9d89c01250.png)

#### 添加事件

小方块已经绘制好了，那么接下来我们来是实现游戏的关键点，那就是交互，我们如何过去到鼠标点击的小方块呢，这个小方块只是canvas画布上的一张图，并不能直接像dom一样添加事件监听，这或许就是这个游戏有意思的地方，那么canvas上有没有什么方法能让我们知道我们具体点击的是哪个小方块呢？搜搜MDN，果然有一个方法可以判断点是否在路径上isPointInPath()；

```javascript
boolean ctx.isPointInPath(x, y);
boolean ctx.isPointInPath(x, y, fillRule);

boolean ctx.isPointInPath(path, x, y);
boolean ctx.isPointInPath(path, x, y, fillRule);
```

> isPointInPath方法返回一个Boolean值，当检测点包含在当前或指定的路径内，返回 true；否则返回 false。

具体方法的使用请参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/isPointInPath)

我们首先获取到鼠标点击canvas的坐标点：

```javascript
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
```

获取到鼠标位置后换算成canvas的相对位置，然后我们给rect类添加一个新方法判断点是否在当前路径内，

```javascript
/**
         * @param  {Object} p {x: num, y: num}
         * @description 判断点是否在这个路径上, 构造路径利用isPointInPath判断点是否在此路径上不用绘制到canvas上
         */
        isPointInPath: function (p) {
            var isIn = false;
            ctx.save();
            ctx.beginPath();
            this.createPath();
            if (ctx.isPointInPath(p.x, p.y)) {
                isIn = true;
            }
            ctx.closePath();
            ctx.restore();
            return isIn;
        }
```

这就是为什么一开始我们没有使用fillRect方法绘制矩形，因为fillRect方法会绘制到画布上，然而我们只是需要构造路径，来使用canvas的isPointInPath方法，而不是要绘制到画布上，因此这里我们巧妙的通过moveTo和lineTo构造路径，然后判断当前点是否在这个小方块内，还记得我们在实例化小方块的时候我们把所有小方块都存到一个datas的数组里吗？我们通过遍历datas数组并且判断点是否在方块内，这样我们就能实现获取点击的具体的某一个小方块了，

```javascript
canvas.addEventListener('mousemove', function (e) {
        var pos = WindowToCanvas(canvas, e.clientX, e.clientY);
        for (var i = 0; i < datas.length; i++) {
            var rect = datas[i];
            if (rect.isPointInPath(pos) && rect.isSpecial) {
                isOn = true;
                break;
            } else {
                isOn = false;
            }
        }
    }, false);

    canvas.addEventListener('click', function (e) {
        if (!START) return;
        if (isOn) {
            drawGame();
            score++;
            scoreDom.innerText = score;
        }
    })
```

然后我们就能实现下一关的操作，重新再绘制游戏网格，重新生成新的颜色和位置了。

#### 总结

通过这个小游戏，可以学习到，canvas点击事件的监听和实现，因为canvas只是一张画布是一个状态机，没法通过dom一样直接操作，但是通过一些“奇淫巧技”我们还是能达到我们的目的。后续我还会继续不定期更新一些canvas的文章，欢迎大家一起探讨和学习。

项目地址：https://github.com/lspCoder/canvas-study/tree/master/Game

还看得过去的希望各位看官给个star。
