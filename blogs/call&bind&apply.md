---
title: call&apply&bind函数封装实现
date: 2022-01-07
categories:
  - 核心知识
tags:
  - JS基础
---

> 我们知道，call、apply、bind 都是和 this 指向有关的，这三个方法是 JavaScript 内置对象 Function 的原型的方法。相当一部分前端工程师对它们的理解仍旧比较浅显，所谓具备 JavaScript 基础扎实，是绕不开这些基础又常用的知识点的，这次让我们来深入理解并掌握它们。

### 1. 语法

```JavaScript
func.call(thisArg, param1, param2, ...)//func是个函数

func.apply(thisArg, [param1,param2,...])

func.bind(thisArg, param1, param2, ...)
```

#### 返回值

> call / apply： 返回 func 执行的结果
>
> bind：返回 func 的拷贝，并拥有指定的 this 值和初始参数。

#### 参数

thisArg(可选):

1. func 的 this 指向 thisArg 对象；
2. 非严格模式下：若 thisArg 指定为 null，undefined，则 func 的 this 指向 window 对象；
3. 严格模式下：func 的 this 为 undefined；
4. 值为原始值(数字，字符串，布尔值)的 this 会指向该原始值的自动包装对象，如 String、Number、Boolean。

> param1，param2(可选): 传给 func 的参数。
> 如果 param 不传或为 null/undefined，则表示不需要传入任何参数.
> apply 第二个参数为类数组对象，数组内各项的值为传给 func 的参数。

### 2.必须是函数才能调用 call/apply/bind

call、apply 和 bind 是挂在 Function 对象上的三个方法，只有函数才有这些方法。只要是函数就可以调用它们，比如: Object.prototype.toString 就是个函数，我们经常看到这样的用法：Object.prototype.toString.call(data)。

### 3. 作用

改变函数执行时的 this 指向，目前所有关于它们的运用，都是基于这一点来进行的。

### 4. 如何不弄混 call 和 apply

弄混这两个方法的不在少数，不要小看这个问题，记住下面的这个方法就好了。双 a 记忆法：apply 是以 a 开头，它传给 func 的参数是类 Array 对象（类数组对象），也是以 a 开头的。

#### call 与 apply 的唯一区别

传给 func 的参数写法不同：

- apply 是第 2 个参数，这个参数是一个类数组对象：传给 func 参数都写在数组中
- call 从第 2~n 的参数都是传给 func 的。

#### call/apply 与 bind 的区别

#### 执行

- call/apply 改变了函数的 this 的指向并马上执行该函数；
- bind 则是返回改变了 this 指向后的函数，不执行该函数。

#### 返回值

- call/apply 返回 func 的执行结果；
- bind 返回 func 的拷贝，并指定了 func 的 this 指向，保存了 func 的参数。

## call/apply/bind 的核心理念：借用方法

#### 比如

A 对象有个方法，B 对象因为某种原因也需要用到同样的方法，那么这时候我们是单独为 B 对象扩展一个方法呢，还是借用一下 A 对象的方法呢？
当然是借用 A 对象的方法更便捷，既达到了目的，又节省了内存。

#### 这就是 call/apply/bind 的核心理念：借用方法。借助已实现的方法，改变方法中数据的 this 指向，减少重复代码，节省内存

还记得刚才的类数组么？如果它想借用 Array 原型链上的 slice 方法，可以这样：

```JavaScript
let domNodes = Array.prototype.slice.call(document.getElementsByTagName("*"));
```

>

### call、apply 应该用哪个？

> call,apply 的效果完全一样，它们的区别也在于
>
> - 参数数量/顺序确定就用 call，参数数量/顺序不确定的话就用 apply。
> - 考虑可读性：参数数量不多就用 call，参数数量比较多的话，把参数整合成数组，使用 apply。
> - 参数集合已经是一个数组的情况，用 apply，比如上文的获取数组最大值/最小值。

> 参数数量/顺序不确定的话就用 apply，比如以下示例：

```JavaScript
const obj = {
    age: 24,
    name: 'OBKoro1',
}

const obj2 = {
    age: 777
}

callObj(obj, handle);
callObj(obj2, handle);

// 根据某些条件来决定要传递参数的数量、以及顺序
function callObj(thisAge, fn) {
    let params = [];

    if (thisAge.name) {
        params.push(thisAge.name);
    }

    if (thisAge.age) {
        params.push(thisAge.age);
    }

    fn.apply(thisAge, params); // 数量和顺序不确定 不能使用call
}

function handle(...params) {
    console.log('params', params); // do some thing
}
```

> bind 的应用场景
>
> - 保存函数参数
>   首先来看下一道经典的面试题：

```JavaScript
for (var i = 1; i <= 5; i++) {
   setTimeout(function test() {
        console.log(i) //>> 6 6 6 6 6
    }, i * 1000);
}
```

造成这个现象的原因是等到 setTimeout 异步执行时,i 已经变成 6 了。那么如何使他输出: 1,2,3,4,5 呢？可以通过 bind 来巧妙实现。

```JavaScript
for (var i = 1; i <= 5; i++) {
    // 缓存参数
    setTimeout(function (i) {
        console.log('bind', i) //>> 1 2 3 4 5
    }.bind(null, i), i * 1000);
}
```

实际上这里也用了闭包，我们知道 bind 会返回一个函数，这个函数也是闭包（下一篇会深度介绍“闭包”的相关知识）。
它保存了函数的 this 指向、初始参数，每次 i 的变更都会被 bind 的闭包存起来，所以输出 1-5。具体细节，下面有个手写 bind 方法，详细阅读一下就能搞明白。

#### 回调函数 this 丢失问题

这是一个常见的问题，下面是我在开发 VSCode 插件处理 webview 通信时，遇到的真实问题，一开始以为 VSCode 的 API 哪里出问题，调试了一番才发现是 this 指向丢失的问题。

```JavaScript
class Page {
    constructor(callBack) {
        this.className = 'Page';
        this.MessageCallBack = callBack; //回调函数
        this.MessageCallBack('发给注册页面的信息'); // 执行PageA的回调函数
    }
}

class PageA {
    constructor() {
        this.className = 'PageA';
        //问题在下面这句
        this.pageClass = new Page(this.handleMessage);//注册页面 传递回调函数
    }

    // 与页面通信回调
    handleMessage(msg) {
        console.log('处理通信', this.className, msg); // 'Page' this指向错误
    }
}

new PageA();
```

回调函数 this 为何会丢失？显然声明的时候不会出现问题，执行回调函数的时候也不可能出现问题。问题出在传递回调函数的时候：

```JavaScript
this.pageClass = new Page(this.handleMessage);
```

因为传递过去的 this.handleMessage 是函数内存地址，没有附带上下文对象，也就是说该函数 this.handleMessage 没有绑定它的 this 指向。
既然知道问题了，那我们只要绑定回调函数的 this 指向为 PageA 就解决问题了。

#### 回调函数 this 丢失的解决方案

#### （1）bind 绑定回调函数的 this 指向

这是典型 bind 的应用场景, 绑定 this 指向，用做回调函数。

```JavaScript
this.pageClass = new Page(this.handleMessage.bind(this));
//绑定回调函数的this指向
```

#### （2）用箭头函数绑定 this 指向

箭头函数的 this 指向定义的时候外层第一个普通函数的 this，在这里指的是 class 类：PageA

```JavaScript
this.pageClass = new Page(() => this.handleMessage());
//箭头函数绑定this指向
```

## 1. call 方法实现

#### 实现思路

- 参考 call 的语法规则，需要设置一个参数 thisArg，也就是 this 的指向；
- 将 thisArg 封装为一个 Object；
- 通过为 thisArg 创建一个临时方法，这样 thisArg 就是调用该临时方法的对象了，会将该临时方法的 this 隐式指向到 thisArg 上）；
- 执行 thisArg 的临时方法，并传递参数；
- 删除临时方法，返回方法的执行结果。

```JavaScript

/**
 * 用原生JavaScript实现call
 */
Function.prototype.myCall = function(thisArg, ...arr) {

  //1.判断参数合法性/////////////////////////
  if (thisArg === null || thisArg === undefined) {
    //指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中为window)
    thisArg = window;
  } else {
    thisArg = Object(thisArg);//创建一个可包含数字/字符串/布尔值的对象，
                              //thisArg 会指向一个包含该原始值的对象。
  }

  //2.搞定this的指向/////////////////////////
  const specialMethod = Symbol("anything"); //创建一个不重复的常量
  //如果调用myCall的函数名是func，也即以func.myCall()形式调用；
  //根据上篇文章介绍，则myCall函数体内的this指向func
  thisArg[specialMethod] = this; //给thisArg对象建一个临时属性来储存this（也即func函数）
  //进一步地，根据上篇文章介绍，func作为thisArg对象的一个方法被调用，那么func中的this便
  //指向thisArg对象。由此，巧妙地完成将this隐式地指向到thisArg！
  let result = thisArg[specialMethod](...arr);

  //3.收尾
  delete thisArg[specialMethod]; //删除临时方法
  return result; //返回临时方法的执行结果
};

let obj = {
  name: "coffe1891"
};

function func() {
  console.log(this.name);
}

func.myCall(obj);//>> coffe1891

// function call(Fn, obj, ...args) {
//   // 判断
//   if (obj === undefined || obj === null) {
//     obj = globalThis
//   }
//   // 为obj添加临时的方法
//   obj.temp = Fn
//   //调用temp的方法
//   let result = obj.temp(...args)
//   // 删除temp的方法
//   delete obj.temp
//   // 返回执行结果
//   return result
// }
```

> 当以非构造函数形式被调用时，Object 等同于 new Object()。

> 多讲一下如何正确地判断 thisArg：

上面代码判断 thisArg 的写法是经过调整后的严谨写法，因为之前笔者发现很多前端工程师判断参数 thisArg，只是简单的以是否为 false 来判断，比如：

> 经过测试，以下三种情况，thisArg 都会意外地绑定到 window 上：

```JavaScript
// 参数明明传了值，本意不是要让thisArg指向window，然后结果却意外地指向了window
func.myCall(''); // window
func.myCall(0); // window
func.myCall(false); // window
```

> 所以应该严谨一点儿判断，如下：

```JavaScript
// 严谨的判断
if (thisArg === null || thisArg === undefined) {
  // 指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中为window)
  thisArg = window;
} else {
  thisArg = Object(thisArg);
  //创建一个包含原始值（数字，字符串，布尔值）的对象，
  //thisArg 会指向一个包含该原始值的对象。
}
```

```JavaScript
// 不够严谨
thisArg = thisArg ? Object(thisArg) : window;
thisArg = thisArg || window;
```

<!-- - 测试 call 函数

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
``` -->

## 2. apply 方法实现

> 实现思路

- 传递给函数的参数处理，不太一样，其他部分跟 call 一样；
- apply 接受第二个参数为类数组对象, 这里用了《JavaScript 权威指南》一书中判断是否为类数组对象的方法。

```JavaScript
/**
 * 用原生JavaScript实现apply
 */
Function.prototype.myApply = function(thisArg) {
  if (thisArg === null || thisArg === undefined) {
    thisArg = window;
  } else {
    thisArg = Object(thisArg);
  }

  //判断是否为【类数组对象】
  function isArrayLike(o) {
    if (
      o && // o不是null、undefined等
      typeof o === "object" && // o是对象
      isFinite(o.length) && // o.length是有限数值
      o.length >= 0 && // o.length为非负值
      o.length === Math.floor(o.length) && // o.length是整数
      o.length < 4294967296
    )
      // o.length < 2^32
      return true;
    else return false;
  }

  const specialMethod = Symbol("anything");
  thisArg[specialMethod] = this;

  let args = arguments[1]; // 获取参数数组
  let result;

  // 处理传进来的第二个参数
  if (args) {
    // 是否传递第二个参数
    if (!Array.isArray(args) && !isArrayLike(args)) {
      throw new TypeError(
        "第二个参数既不为数组，也不为类数组对象。抛出错误"
      );
    } else {
      args = Array.from(args); // 转为数组
      result = thisArg[specialMethod](...args); // 执行函数并展开数组，传递函数参数
    }
  } else {
    result = thisArg[specialMethod]();
  }

  delete thisArg[specialMethod];
  return result; // 返回函数执行结果
};
```

## 3. 实现 bind

> 手写实现 bind 是一线互联网企业中的一个高频的面试题，如果面试的中高级前端，只是能说出它们的区别、用法并不能让你脱颖而出，对 bind 的理解要有足够的深度，才能得到面试官的赞许。
>
> 实现思路
> （1）拷贝调用函数:

- 调用函数，也即调用 myBind 的函数，用一个变量临时储存它；
- 使用 Object.create 复制调用函数的 prototype 给 funcForBind；
  （2）返回拷贝的函数 funcForBind
  （3）调用拷贝的函数 funcForBind
- new 调用判断：通过 instanceof 判断函数是否通过 new 调用，来决定绑定的 context；
- 通过 call 绑定 this、传递参数；
- 返回调用函数的执行结果。

#### 基于 ES6 的实现

```JavaScript
/**
 * 用原生JavaScript实现bind
 */
Function.prototype.myBind = function(objThis, ...params) {
  const thisFn = this;//存储调用函数，以及上方的params(函数参数)
  //对返回的函数 secondParams 二次传参
  let funcForBind = function(...secondParams) {
    //检查this是否是funcForBind的实例？也就是检查funcForBind是否通过new调用
    const isNew = this instanceof funcForBind;

    //new调用就绑定到this上,否则就绑定到传入的objThis上
    const thisArg = isNew ? this : Object(objThis);

    //用call执行调用函数，绑定this的指向，并传递参数。返回执行结果
    return thisFn.call(thisArg, ...params, ...secondParams);
  };

  //复制调用函数的prototype给funcForBind
  funcForBind.prototype = Object.create(thisFn.prototype);
  return funcForBind;//返回拷贝的函数
};
```

上面的代码第 7 行可能不好理解，二次传参(secondParams)是说什么？举个例子：

```JavaScript
let func = function(p,secondParams){//其实测试用的func其参数可以是任意多个
    console.log(p.name);
    console.log(this.name);
    console.log(secondParams);
}
let obj={
    name:"1891"
}
func.myBind(obj,{name:"coffe"})("二次传参");
//>> coffe
//>> 1891
//>> 二次传参
```
