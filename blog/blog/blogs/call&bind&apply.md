---
title: call&apply&bind函数封装实现
date: 2022-02-07
categories:
  - 基础
tags:
  - JavaScript
---

```JavaScript
function call(Fn, obj, ...args) {
  // 判断
  if (obj === undefined || obj === null) {
    obj = globalThis
  }
  // 为obj添加临时的方法
  obj.temp = Fn
  //调用temp的方法
  let result = obj.temp(...args)
  // 删除temp的方法
  delete obj.temp
  // 返回执行结果
  return result
}
```

- 测试 call 函数

```JavaScript
 // 声明一个函数
 function add(a, b) {
   console.log(this)
   return a + b + this.c
 }
 // 声明一个对象
 let obj =  {
   c: 521
 }
 // 添加全局属性
 window.c = 1314

 // 执行call 函数
 console.log(call(add, obj, 10, 20)); // 551
 console.log(call(add, null, 30, 40)); // 1384
```
