(function () {
    Button = function (option, ctx) {
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.width = option.width || 200;
        this.height = option.height || 80;
        this.radius = option.radius || 0;
        this.style = this._btnStyle[option.style || 'blue'];
        this.text = option.text || 'Button';
        this.fontColor = option.fontColor || '#FFFFFF';
        this.ctx = ctx;
    }

    Button.prototype = {
        constructor: Button,

        _state: '',

        _btnStyle: {
            'blue': {
                backgroundColor: '#55acee',
                shadowColor: '#3C93D5',
                hoverColor: '#6FC6FF',
            },
            'green': {
                backgroundColor: '#2ecc71',
                shadowColor: '#15B358',
                hoverColor: '#48E68B',
            },
            'red': {
                backgroundColor: '#e74c3c',
                shadowColor: '#CE3323',
                hoverColor: '#FF6656',
            },
            'purple': {
                backgroundColor: '#9b59b6',
                shadowColor: '#82409D',
                hoverColor: '#B573D0',
            },
            'orange': {
                backgroundColor: '#e67e22',
                shadowColor: '#CD6509',
                hoverColor: '#FF983C',
            },
            'yellow': {
                backgroundColor: '#f1c40f',
                shadowColor: '#D8AB00',
                hoverColor: '#FFDE29',
            }
        },

        createPath: function (x, y, width, height, radius) {
            this.ctx.moveTo(x, y + radius);
            this.ctx.lineTo(x, y + height - radius);
            this.ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
            this.ctx.lineTo(x + width - radius, y + height);
            this.ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
            this.ctx.lineTo(x + width, y + radius);
            this.ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
            this.ctx.lineTo(x + radius, y);
            this.ctx.quadraticCurveTo(x, y, x, y + radius);
        },

        /**
         * @param  {Object} p {x: num, y: num}
         * @description 判断点是否在这个路径上, 构造路径利用isPointInPath判断点是否在此路径上不用绘制到canvas上
         */
        isPointInPath: function (p) {
            var isIn = false;
            var ctx = this.ctx;
            var x = this.x,
                y = this.y,
                width = this.width,
                height = this.height,
                radius = this.radius;
            ctx.save();
            ctx.beginPath();
            this.createPath(x, y, width, height, radius);
            if (ctx.isPointInPath(p.x, p.y)) {
                isIn = true;
            }
            ctx.closePath();
            ctx.restore();
            return isIn;
        },

        setState: function (state) {
            this.state = state;
            this.drawBtn();
        },

        _getColorByState: function (state) {
            if (state === 'hover') {
                return this.style.hoverColor;
            } else if (state === 'active') {
                return this.style.hoverColor;
            } else {
                return this.style.backgroundColor;
            }
        },

        _getShadowByState: function (state) {
            if (state === 'hover') {
                return this.setShadow(0, 5);
            } else if (state === 'active') {
                return this.setShadow(0, 1);
            } else {
                return this.setShadow(0, 5);
            }
        },

        //绘制圆角矩形
        drawBtn: function () {
            var x = this.x,
                y = this.y,
                width = this.width,
                height = this.height,
                radius = this.radius,
                style = this.style;
            this.ctx.clearRect(x, y, width, height);
            if (this.state === 'active') {
                y = y + 5;
            }
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = this._getColorByState(this.state);
            this._getShadowByState(this.state);
            this.createPath(x, y, width, height, radius);
            this.ctx.fill();
            this.ctx.restore();
            this.drawText();
        },

        setShadow: function (xoffset, yoffset) {
            var style = this.style;
            this.ctx.shadowOffsetX = xoffset || 0;
            this.ctx.shadowOffsetY = yoffset || 5;
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = style.shadowColor;
        },

        drawText: function () {
            var xoffset = this.ctx.measureText(this.text).width;
            var x = this.x,
                y = this.y;
            if (this.state === 'active') {
                y = y + 5;
            }
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.font = "30px Micosoft yahei";
            this.ctx.fillStyle = this.fontColor;
            this.ctx.textBaseline = 'middle';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.text, x + (this.width - xoffset) / 2 + 10, y + (this.height - 22) / 2 + 5, this.width);
            this.ctx.closePath();
            this.ctx.restore();
        },


    }
}())