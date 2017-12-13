---
title: Canvas画出毛边？这里是一种抗锯齿的方法
date: 2017-10-15 15:00:41
tags:
---

> Canvas可以轻易的解决很多传统方法处理起来十分费力的问题，目前老式浏览器占比越来越小，尤其是在移动端，许多问题都可以放心的使用Canvas进行处理。<br/>
然而在最近使用的过程中我遇到了一个问题，使用Canvas绘制出的曲线，存在很大的毛边，本文简单介绍一种可以消除毛边的简单方法。

## 问题
问题的由来是我在使用Canvas绘制一个圆形进度条时，在绘制出进度条后发现进度条显示的质量很差，整个圆形的周边充斥着毛边，因此寻求一种有效的抗锯齿解决办法。

![](/images/canvasAA/juchi.png)

## 解决办法

为了解决锯齿的问题，我们使用一种简单的缩放方式来减小绘制图形的锯齿。
该方法有几个关键点：

- 将canvas元素放入一个固定宽高的容器中，并且正常给canvas一个宽高（通常与外层容器一样即可）
````html
<div class="m-canvas-container">
    <canvas id="canvas" height="200" width="200"></canvas>
</div>
````

- 在css中将canvas元素的width设置为100%。
````css
#canvas {
    width: 100%;
}
````

- 在绘制canvas时，定义一个缩放参数SCALE，将canvas的height和width扩大SCALE倍，后续所有绘制都放大SCALE倍。
````javascript
function draw() {
    canvas.width = SCALE * canvas.width;
    canvas.height = SCALE * canvas.height;
}
````

![](/images/canvasAA/AA.png)
