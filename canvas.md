## canvas基础

##### 1.canvas标签元素

```javascript
var canvas = document.getElementById('canvas');
canvas默认width为300，height为150
var ctx = canvas.getContext('2d');       //2d渲染上下文对象CanvasRenderingContext2D
通过canvas.style改变画布的宽高会拉伸图形，扭曲画布

//检查支持性
if (canvas.getContext){
  var ctx = canvas.getContext('2d');
  // drawing code here
} else {
  // canvas-unsupported code here
}
```

##### 2.画布栅格

![](https://i.loli.net/2018/09/11/5b97ab0920450.png)

canvas中栅格每一个单元都是一个像素

栅格的起点在左上角，坐标（0，0）

##### 3.绘制矩形

```javascript
fillRect(x, y, width, height)        //填充矩形
strokeRect(x, y, width, height)       //矩形描边
clearRect(x, y, width, height)       //清除画布，清除部分完全透明

rect(x, y, width, height)           //矩形路径，需要配和fill和stroke
```

##### 4.绘制路径

```
beginPath()     //新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
closePath()        //闭合路径之后图形绘制命令又重新指向到上下文中。fill方法默认闭合，
stroke()        //通过线条来绘制图形轮廓。
fill()       //通过填充路径的内容区域生成实心的图形
moveTo(x, y)       //移动画笔到指定点
lineTo(x, y)         //当前点到指定点的直线
```

路径的本质是由很多个子路径组成，每次beginPath就像重新new了一个数组，清空以前的子路径，绘制新路径

##### 5.绘制圆弧

```javascript
ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);    //x,y圆心坐标，半径，开始弧度，结束弧度，anticlockwise为false顺时针反之逆时针
角度与弧度的计算公式：弧度=(Math.PI/180)*角度
```

##### 6.贝塞尔曲线

```javascript
quadraticCurveTo(cp1x, cp1y, x, y) //cp1x,cp2y为控制点，x和y为结束点
bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)  //cp1x, cp1y, cp2x, cp2y两个控制点
```

![](https://i.loli.net/2018/09/11/5b97c13c030dd.png)

![](https://i.loli.net/2018/09/11/5b97c04e17bc8.gif)

![](https://i.loli.net/2018/09/11/5b97c1509786c.png)

![](https://i.loli.net/2018/09/11/5b97c04bcf4c5.gif)

> 参考大漠老师的文档:https://www.w3cplus.com/canvas/drawing-curve.html

##### 7.Path2D 对象

```js
new Path2D();     // 空的Path对象
new Path2D(path); // 克隆Path对象
new Path2D(svg);    // 从SVG建立Path对象
ctx.fill(path2D);
ctx.stroke(path2D);     //路径对象创建后需要使用fill和stroke绘制到画布上；

new Path2D("M10 10 h 80 v 80 h -80 Z");    //先移动到点 (M10 10) 然后再水平移动80个单位(h 80)，然后下移80个单位 (v 80)，接着左移80个单位 (h -80)，再回到起点处 (z)
```

##### 8.canvas样式

```js
ctx.fillStyle = color         //颜色值接受属于css3规范的颜色值
ctx.strokeStyle = color
ctx.globalAlpha = transparencyValue         //0为完全透明，1为完全不透明
ctx.lineWidth = 1.0      //画笔线宽
ctx.lineCap = butt //round, square
ctx.lineJoin = miter //round,bevel
ctx.setLineDash([线长, 间距])     //数组长度为1代表线长和间距相等的虚线
ctx.lineDashOffset = Number    //设置虚线的其实偏移量,配合动画可以绘制流动的虚线效果
var gradient = ctx.createLinearGradient(x1, y1, x2, y2)       //渐变起点和渐变终点，线性渐变
var gradient =ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)    //径向渐变
gradient.addColorStop(position, color)        //position为0~1,第二个是个css颜色值
ctx.createPattern(image, type)       //需要先加载Image对象，type:repeat,repeat-x,repeat-y和no-repeat
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;
ctx.shadowBlur = 2;
ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

ctx.fillText(text, x, y, maxWidth);          //maxWidth可有可无
ctx.strokeText(text, x, y, maxWidth);
ctx.font = "10px sans-serif";
ctx.textAlign = start;     //可选值start, end, left, right or center
ctx.textBaseLine = alphabetic;       //可选值:top, hanging, middle, alphabetic, ideographic, bottom
ctx.direction = inherit    //可选值ltr, rtl, inherit
ctx.measureText(text)        //测量文本的宽度
```

> **注意**
>
> 1像素的线宽未必线宽为1，因此在绘制1像素的线时注意不要绘制在两个像素的交界处
>
> ![](https://i.loli.net/2018/09/18/5ba0fab46b0f0.png)



