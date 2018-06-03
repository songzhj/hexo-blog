/**
 * Created by songzhj on 2018/6/3.
 */

const element = document.querySelector("#name");
Transform(element);
element.originY = 40;
element.translateY = 40;
element.skewX = -20;

function sineInOut(a) {
    return 0.5 * (1 - Math.cos(Math.PI * a));
}

const alloyFlow = new AlloyFlow({
    workflow: [
        {
            work: function () {
                To.go(element, "scaleY", .8, 400, sineInOut);
                To.go(element, "skewX", 20, 800, sineInOut)
            },
            start: 0
        }, {
            work: function () {
                To.go(element, "scaleY", 1, 400, sineInOut)
            },
            start: 450
        }, {
            work: function () {
                To.go(element, "scaleY", .8, 400, sineInOut);
                To.go(element, "skewX", -20, 800, sineInOut)
            },
            start: 900
        }, {
            work: function () {
                To.go(element, "scaleY", 1, 400, sineInOut);
            },
            start: 1350
        }, {
            work: function () {
                this.start();
            },
            start: 1800
        }
    ]
}).start();