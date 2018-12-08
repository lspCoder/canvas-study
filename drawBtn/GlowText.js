(function () {
    GlowText = function (option, ctx) {
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.width = option.width || 200;
        this.height = option.height || 80;
        this.text = option.text || 'Text';
        this.fontColor = option.fontColor || '#FFF';
        this.ctx = ctx;
    }

    GlowText.prototype = {
        constructor: GlowText,


        setShadow: function (shadowx, shadowy, blur, shadowColor) {
            this.ctx.shadowOffsetX = shadowx || 0;
            this.ctx.shadowOffsetY = shadowy || 0;
            this.ctx.shadowBlur = blur || 10;
            this.ctx.shadowColor = shadowColor;
        },

        drawGlowText: function () {
            this.fromGlow();
            this.toGlow();
        },

        fromGlow: function () {
            this.drawText(0, 0, 10, '#FFF');
            this.drawText(0, 0, 20, '#FFF');
            this.drawText(0, 0, 30, '#FFF');
            this.drawText(0, 0, 40, '#00a67c');
            this.drawText(0, 0, 70, '#00a67c');
            this.drawText(0, 0, 80, '#00a67c');
            this.drawText(0, 0, 100, '#00a67c');
            this.drawText(0, 0, 150, '#00a67c');
        },

        toGlow: function () {
            this.drawText(0, 0, 5, '#FFF');
            this.drawText(0, 0, 10, '#FFF');
            this.drawText(0, 0, 15, '#FFF');
            this.drawText(0, 0, 20, '#00a67c');
            this.drawText(0, 0, 35, '#00a67c');
            this.drawText(0, 0, 40, '#00a67c');
            this.drawText(0, 0, 50, '#00a67c');
            this.drawText(0, 0, 75, '#00a67c');
        },

        drawText: function (shadowx, shadowy, blur, shadowColor) {
            var xoffset = this.ctx.measureText(this.text).width;
            var x = this.x,
                y = this.y;
            this.ctx.save();
            this.ctx.beginPath();
            this.setShadow(shadowx, shadowy, blur, shadowColor);
            this.ctx.font = "300px Micosoft yahei";
            this.ctx.fillStyle = this.fontColor;
            this.ctx.textBaseline = 'middle';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.text, x + (this.width - xoffset) / 2 + 10, y + (this.height - 22) / 2 + 5, this.width);
            this.ctx.closePath();
            this.ctx.restore();
        },

    }
}())