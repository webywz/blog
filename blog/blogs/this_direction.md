---
title: 一网打尽this
date: 2021-05-07
categories:
 - 核心知识
tags:
 - JS基础
---
# this到底指向谁
> 一句话总结this指向（注意只用一句话）
> 有一种广为流传的说法
> 谁调用它，this就指向谁
* 也就是说 this的指向是在调用时确定的。 这样说是没太大问题的，可惜并不全面 
### "死记硬背" 一下几条规律：
> 1. 在函数体中，非显式或隐式的简单调用函数时，在严格模式下，在函数内的this会被绑定到undefined上，在非严格模式下则会被绑定到全局对象window/global上
> 2. 一般使用new 方法调用构造函数时，构造函数内的this会被绑定到新创建的对象上
> 3. 一般通过call/apply/bind 方法显示调用函数时，函数体内的this会被绑定到指定参数的对象上
> 4. 一般通过上下文对象调用函数时，函数体内的this会被绑定到该对象上
> 5. 在箭头函数中，this的指向是由外层（函数或全局）作用域来决定的
### 实战例题分析
#### 1. 全局环境中的this
```javascript
   function f1 () {
      console.log(this)
   }
   function f2 () {
      'use strict'
      console.log(this)
   }
f1() // window
f2() // undefined

* 这种情况相对简单, 严格和非严格的区别


// 上面的题目比较基础，需要注意其变种题
const foo = {
  bar: 10,
  fn: function () {
    console.log(this)
    console.log(this.bar)
  }
}
var fn1 = foo.fn()
fn1() // window // undefined
这里的this仍然指向window, 
虽然fn函数在foo对象中用来作为对象的方法, 但是在赋值给fn1之后
fn1仍然是在window的环境中执行的

// 如果上面这道题不进行赋值，直接使用foo.fn()调用
// 则会输出 { bar: 10, fn: f } ---- 10
```
> this的指向是最后调用它的对象，在foo.fn()语句中，this指向foo对象，
> 在执行函数时不考虑显示绑定，如果函数中的this被上一级的对象所调用，那么this指向的就是上一级的对象，否则指向全局环境

#### 2. 上下文对象调用中的this
```javascript
const student = {
  name: 'Lucas',
  fn: function () {
    return this
  }
}

console.log(student.fn() === student) // true

// 当纯在更复杂的调用关系时, 嵌套关系, this会指向最后调用它的对象
const person = {
  name: 'Lucas',
  brother: {
    name: 'Mike',
    fn: function () {
      return this.name
    }
  }
}

console.log(person.brother.fn()) // Mike
```
```javascript
    const o1 = {
      text: 'o1',
      fn: function () {
        return this.text
      }
    }
    
    const o2 = {
      text: 'o2',
      fn: function () {
        return o1.fn()
      }
    }
    
    const o3 = {
      text: 'o3',
      fn: function () {
        let fn = o1.fn();
        return fn()
      }
    }
    
    console.log(o1.fn())
    console.log(o2.fn())
    console.log(o3.fn())
    // o1
    // o1
    // undefined
//* 第一个输入最简单, 难点在第二个和第三个上, 关键还是看调用this的那个函数
//* 第二个中o2.fn(),最终调用还是o1.fn(), 因此结果还是o1
//* 最后一个o3.fn()通过let fn = o1.fn() 的赋值进行'裸奔', 因此这里的this指向全局window, 结果是undefined
```
#### 3. 通过bind、call、apply 改变this指向
> 它们都是用来改变相关函数this指向的，但是call和apply是直接进行相关函数调用的；bind不会执行相关函数，而是返回一个新的函数，这个新的函数已经自动绑定了新的this指向，开发者可以手动调用它。
> 具体一点就是call和apply 之间的区别主要体现在现在参数设定上
```javascript
   const foo = {
     name: 'lucas',
     logName: function () {
       console.log(this.name)
     }
   }
   const bar = {
     name: 'mike'
   }
   
   console.log(foo.logName().call(bar)) // mike
   // 以上代码打印mike 对call，apply，bind的高级考察，需要结合构造函数及组合来实现继承
```
#### 4.构造函数和this
```JavaScript
    function Foo () {
      this.bar = 'lucas'
    }
    const instance = new Foo()
    console.log(instance.bar) // lucas
```
> 以上代码会输出lucas 这样的场景往往伴随着一个问题，new操作符调用构造函数时具体做了什么
(简单版本) 仅供参考
* 创建一个新的对象
* 将构造函数的this指向这个新对象
* 为这个对象添加属性，方法等
* 最后返回新的对象

<font color=red>构造函数中显示返回一个值，且返回的是一个对象（返回复杂类型），那么this就指向这个返回的对象；如果是返回基本类型，那么this仍然指向实例</font>

#### 5.箭头函数中的this
> 在箭头函数中，this的指向是由外层（函数或全局）作用域来决定的
>《你不知道的JavaScript》书中描述 箭头函数中的this： the enclosing(function or global) scope (说明：箭头函数中的this指向是由其所属函数和全局作用域决定的)
```javascript
const foo = {
  fn: function () {
    setTimeout(function () {
      console.log(this)
    })
  }
}
console.log(foo.fn()) // window


const foo = {
  fn: function () {
    setTimeout(() => {
      console.log(this)
    })
  }
}
console.log(foo.fn()) // { fn: f} 

结合this的优先级考察, 箭头函数的指向就并不容易确定了
```

#### 6. this优先级
> call、apply、bind、new 对this进行绑定的情况称为显示绑定
> 根据调用关系确定this指向的情况称为隐式绑定

<font color='red'>call,apply的显示绑定一般来说优先级更高</font>

<font color='red'>new 绑定比bind绑定的优先级更高</font>

<font color='red'>箭头函数的绑定无法被修改</font>

### 实现一个bind函数
```javascript
    Function.prototype.bind = Function.prototype.bind || function (context) {
      var me = this
      var args = Array.prototype.call(arguments, 1)
      return function bound () {
        var inneArgs = Array.prototype.slice.call(arguments)
        var finalArgs = args.concat(inneArgs)
        return me.apply(context, finalArgs)
      }
    }
```
bind函数如果作为构造函数搭配new关键字出现，绑定的this就会被'忽略'

为了实现这个的规则，需要考虑如何区分这两种调用方式，具体来讲就是在bound函数中
进行this instanceof判断

函数具有length属性， 用来表示形参个数，在上述实现方法中，形参的个数显然会失真，改进的实现方式需要对length属性进行还原。 难点在于，函数中的length属性值是不可重写的

