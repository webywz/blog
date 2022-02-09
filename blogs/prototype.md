---
title: 原型和原型链
date: 2022-01-18
categories:
  - 核心知识
tags:
  - JS基础
---

## 原型和原型链

> JavaScript 在解决复用性方面做过很多尝试，最终确定了利用原型和原型链来解决。这和 Java 等高级语言有很大的不同，Java 可以通过 extend 关键字继承某个类（class）以轻松实现复用。

> 而在 ES6 之前，JavaScript 中除了基础类型外的数据类型都是对象（引用类型），没有类（class），为了实现类似继承以便复用代码的能力，JavaScript 选择了原型和原型链。甚至在 ES6 之后，JavaScript 也没有真正的类（class）。ES6 虽然提供了 class 关键字让我么可以伪造一个“类”，但其实只是语法糖而已，本质上仍然是一个对象。ES6 实现的继承，本质仍是基于原型和原型链。

### 原型、prototype、**proto**

- 1. 原型是一个对象。
- 2. prototype 是函数的一个属性而已，也是一个对象，它和原型没有绝对的关系（很多书、很多网络文章都模糊地将 prototype 表述为原型，这是严重不对的）。JavaScript 里函数也是一种对象，每个对象都有一个原型，但不是所有对象都有 prototype 属性，实际上只有函数才有这个属性。

```JavaScript
var a = function(){};
var b=[1,2,3];

//函数才有prototype属性
console.log(a.prototype);//>> function(){}
//非函数，没有prototype属性
console.log(b.prototype);//>> undefined

```

- 3. 每个对象(实例)都有一个属性\_\_proto\_\_，指向他的构造函数（constructor）的 prototype 属性。

- #### 4. 一个对象的原型就是它的构造函数的 prototype 属性的值，因此\_\_proto\_\_也即原型的代名词

- 5. 对象的\_\_proto\_\_也有自己的，层层向上，直到\_\_proto\_\_为 null。换句话说，原型本身也有自己的原型。这种由原型层层链接起来的数据结构成为 原型链。因为 null 不再有原型，所以原型链的末端是 null。

用代码来验证一下以上结论：

```JavaScript
var a = function(){};
var b=[1,2,3];

//a的构造函数是「Function函数」
console.log(a.__proto__ == Function.prototype);//>> true
//b的构造函数是「Array函数」
console.log(b.__proto__ == Array.prototype);//>> true

//因为「Function函数」和「Array函数」又都是对象，其构造函数
//是「Object函数」，所以，a和b的原型的原型都是Object.prototype
console.log(a.__proto__.__proto__ === Object.prototype);//>> true
console.log(b.__proto__.__proto__ === Object.prototype);//>> true

//Object作为顶级对象的构造函数，它实例的原型本身就不再有原型了，因此它原型
//的__proto__属性为null
console.log(new Object().__proto__.__proto__);//>> null
//也即Object类型对象，其原型（Object.prototype）的__proto__为null
console.log(Object.prototype.__proto__);//>> null
```

三者关系图如下：

![alt 属性文本](https://842336892-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-LnlixiOMXyluGpXDGGs%2F-LqL4S47NtCFtSeKpeyF%2F-LqL6hjVNj8qshfwmk-A%2Fimage.png?alt=media&token=bfac5578-0462-4578-963f-08f28f52a3c9)

> 使用\_\_proto\_\_是有争议的，也不鼓励使用它。因为它从来没有被包括在 EcmaScript 语言规范中，但是现代浏览器都实现了它。\_\_proto\_\_属性已在 ECMAScript 6 语言规范中标准化，用于确保 Web 浏览器的兼容性，因此它未来将被支持。但是，它已被不推荐使用，现在更推荐使用 Object.getPrototypeOf/Reflect.getPrototypeOf 和 Object.setPrototypeOf/Reflect.setPrototypeOf（尽管如此，设置对象的原型是一个缓慢的操作，如果性能要求很高，应该避免设置对象的原型）。

### 原型继承

使用最新的方法 Object.setPrototypeOf（类似 Reflect.setPrototypeOf）可以很方便地给对象设置原型，这个对象会继承该原型所有属性和方法。

但是，setPrototypeOf 的性能很差，我们应该尽量使用 Object.create()来为某个对象设置原型。

```JavaScript
//obj的原型是Object.prototype
var obj={
    methodA(){
        console.log("coffe");
    }
}

var newObj = Object.create(obj);//以obj为原型创建一个新的对象

//methodA实际上是newObj原型对象obj上的方法。也即newObj继承了它的原型对象obj的属性和方法。
newObj.methodA();//>> coffe
```

### 原型链的查找机制

当我们访问某个对象的方法或者属性，如果该对象上没有该属性或者方法，JS 引擎就会遍历原型链上的每一个原型对象，在这些原型对象里面查找该属性或方法，直到找到为止，若遍历了整个原型链仍然找不到，则报错。代码示例如下：

```JavaScript
var obj={
    methodA(){
        console.log("coffe");
    }
}

var newObj = Object.create(obj);//以obj为原型创建一个新的对象

newObj.hasOwnProperty("methodA");//>> false
```

上面的代码，hasOwnProperty 方法并未在 newObj 上定义，也没有在它的原型 obj 上定义，是它原型链上原型 Object.prototype 的方法。其原型链查找顺序如下图所示：

![alt 属性文本](https://842336892-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-LnlixiOMXyluGpXDGGs%2F-LqL4S47NtCFtSeKpeyF%2F-LqL7OHWH2auaJPsxq3t%2Fimage.png?alt=media&token=72f27c66-9750-49f5-84d8-a7cf510eac1b)

和作用域链上“变量的查找机制”比较相似, 这就是 JavaScript 所遵循的设计美学之一：归一化。可以理解成一致性、相似性。

### 再来说说类(class）的 prototype 和\_\_proto\_\_

ES6 之后，类(class)也有了 prototype 属性，为什么呢，因为 class 本质上是构造函数的语法糖。不信可以看如下代码：

```JavaScript
class A {
}

typeof A;//>> "function"
```

说明 class 本质上也是函数，所以它带有 prototype 属性是十分正常的事。

然后，在 Chrome 浏览器里调试如下代码：

```JavaScript
class A {
}

A.prototype;
```

![alt 属性文本](https://842336892-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-LnlixiOMXyluGpXDGGs%2F-M4kyDeGbc7JnoZhi6bd%2F-M4kz-Nsk0-ZgSK8R4rE%2F1.2.6.4.1.png?alt=media&token=fdba9392-0e6b-4fb9-807d-96885f18ccfa)

上面代码说明类的 prototype 是一个对象，它包含有 constructor 属性。这和函数的 prototype 属性表现具有一致性。

```JavaScript
class A {
}

A===A.prototype.constructor;//>> true
```

上面代码说明一个重要结论：<b> 类本身指向的构造函数</b>

而且，事实上，<b>类的所有方法都定义在类的 prototype 属性上面。</b> 同样可以通过 Chrome 调试验证，请自行验证。

```JavaScript
class A{
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于
A.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```

### 定理

class 作为构造函数的语法糖，同时有 prototype 属性和\_\_proto\_\_属性，因此同时存在两条继承链。
（1）子类的\_\_proto\_\_属性，表示构造函数的继承，总是指向父类。
（2）子类 prototype 属性的\_\_proto\_\_属性，表示方法的继承，总是指向父类的 prototype 属性。

```JavaScript
class A {
}

class B extends A {
}

B.__proto__ === A //>> true
B.prototype.__proto__ === A.prototype //>> true
```
