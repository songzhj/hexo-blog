---
title: 你可能不知道的React之setState
date: 2017-12-10 16:42:59
tags:
---

setState是React中一个最基本的方法，它会将state更新到新的状态并触发页面的重新渲染。最近看了一眼官方文档，才发现我一点都不了解这个常用的方法。

## 平时用的setState
通常情况下，在使用setState的时候，都是直接将要更新的状态传入。
```javascript
this.setState({
    a: 'newState'
});
```
讲道理，正常使用的时候这么用是不会遇到什么问题的，但是如果你连续改变了一个state的值，那可能会遇到一些问题，比如这样：
```javascript
// this.state初始状态{a: 0}
function f() {
    this.setState({a: this.state.a + 1});
    this.setState({a: this.state.a + 1});
    this.setState({a: this.state.a + 1});
}
```
当上面的函数f执行之后，this.state.a的值是多少呢？结果出乎意料，a的值是1。仔细想想这是有道理的，React并不会每次setState后立即触发更新的过程，如果真的这样的话效率未免会太低了，它会将上面的3次setState攒一波，然后一起setState。所以三次setState中的this.state.a的值都是原来的值（{a: 0}），最后的结果就是1。

## setState能传一个函数
让我惊讶的是，setState能传一个函数进去，函数有两个参数：第一个参数是当前的state，第二个参数是props；函数最后return回去的对象就会形成新的state。于是上面的过程可以改写成这样：
```javascript
// this.state初始状态{a: 0}
function add(state, props) {
    return {a: state.a + 1};
}
function f() {
    this.setState(add);
    this.setState(add);
    this.setState(add);
}
```
这种情况下，当f执行后会发现，this.state.a的值是3。这是因为函数式的传参会将每次state的改动记录下来，因此a每次增加都会被正确的记录并最终更新到新的state。
> 需要注意的是，使用函数式传参的方式，state的值并没有真的改变，同样是攒了一波，等到render函数执行的时候真正的state才会被更新。

## setState还能传一个回调函数
setState这个方法还能接受第二个参数，是一个回调函数，它在setState完成是被调用，该回调函数的参数是更新后的state。但是官方并不推荐用这种写法，通常这样的操作都可以在componentDidUpdate中进行。

## 其它
[setState的官方文档](https://facebook.github.io/react/docs/react-component.html#setstate)