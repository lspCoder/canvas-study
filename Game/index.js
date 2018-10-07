(function () {
    var canvas = document.getElementById('canvas');
    if (!canvas.getContext('2d')) {
        alert('你的浏览器不支持canvas，请换个浏览器试试');
    }
    var ctx = canvas.getContext('2d');
    
    var datas = [];
    var step = 0;

    var TIME = 30;
    var timeDom = document.getElementById('time');
    timeDom.innerText = TIME;

    var score = 0;
    var scoreDom = document.getElementById('score');
    scoreDom.innerText = score;

    var btn = document.getElementById('start');

    var START = false;
    var timer;

    function startGame() {
        START = true;
        datas = [];
        step = 0;
        score = 0;
        TIME = 30;

        drawGame();

        if (!timer) {
            timer = window.setInterval(function () {
                timeDom.innerText = TIME--;
                if (TIME === -1) {
                    clearInterval(timer);
                    gameOver();
                }
            }, 1000);
        }
    }

    function gameOver() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var text = 'Game Over!';
        ctx.fillStyle = 'red';
        ctx.font = "50px sans-serif";
        var measure = ctx.measureText(text);
        ctx.fillText(text, (canvas.width - measure.width) / 2, (canvas.height - 50) / 2);

        btn.style.display = 'inline-block';

        START = false;
    }
    
    btn.addEventListener('click', function (e) {
        startGame();

        btn.style.display = 'none';
    }, false);

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
    /**
     * 随机数
     * @param {number} min 最小值
     * @param {number} max 最大值
     */
    function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    var isOn = false;

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

    var Rect = function (opt) {
        this.x = opt.x;
        this.y = opt.y;
        this.width = opt.width;
        this.height = opt.height;
        this.fillStyle = opt.fillStyle;
    }

    Rect.prototype = {
        constructor: Rect,

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

        updateStyle: function (fillStyle) {
            this.fillStyle = fillStyle;
            this.isSpecial = true;
            return this;
        },

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
    }
    

    function drawGame() {
        datas = [];       //清空状态
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        step++;
        let col; // 列数
        // 设置列数，最高不超过16
        if (step < 6) {
            col = step + 1;
        } else if (step < 12) {
            col = Math.floor(step / 2) * 2;
        } else if (step < 18) {
            col = Math.floor(step / 3) * 3;
        } else {
            col = 16;
        }

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
    }
    drawGame();
    

}(window, undefined))