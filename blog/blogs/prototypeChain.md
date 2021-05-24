---
title: 原型链
date: 2021-05-07
categories:
 - 面试提
tags:
 - JS基础
---
<https://github.com/mqyqingfeng/Blog/issues/2>

## prototype

只有函数有prototype属性

``` javascript
  let a = {}
  let b = function () { }
  console.log(a.prototype) // undefined
  console.log(b.prototype) // { constructor: function(){...} }
```

Object.prototype怎么解释？
> 其实Object是一个全局对象，也是一个构造函数，以及其他基本类型的全局对象也都是构造函数：

```javascript
function outTypeName(data, type) {
    let typeName =  Object.prototype.toString.call(data)
    console.log(typeName)
}
outTypeName(Object) //[object Function]
outTypeName(String) // [object Function]
outTypeName(Number) // [object Function]
```

为什么只有函数有prototype属性
> JS通过new来生成对象，但是仅靠构造函数，每次生成的对象都不一样。

有时候需要在两个对象之间共享属性，由于JS在设计之初没有类的概念，所以JS使用函数的prototype来处理这部分需要被共享的属性，通过函数的prototype来模拟类：

 > 当创建一个函数时，JS会自动为函数添加prototype属性，值是一个有constructor的对象。

以下是共享属性prototype的栗子：

```javascript
function People(name) {
    this.name = name
}
People.prototype.age = 23 // 岁数
// 创建两个实例
let People1 = new People('OBKoro1')
let People2 = new People('扣肉')
People.prototype.age = 24 // 长大了一岁
console.log(People1.age, People2.age) // 24 24
```

为什么People1和People2可以访问到People.prototype.age？

原因是：People1和People2的原型是People.prototype，答案在下方的：构造函数是什么以及它做了什么。

## 原型链

__proto__和Object.getPrototypeOf(target)： 对象的原型
__proto__ 是对象实例和它的构造函数之间建立的链接，它的值是：构造函数的`prototype。

也就是说：__proto__ 的值是它所对应的原型对象，是某个函数的prototype

Object.getPrototypeOf(target)全等于__proto__ 。

> 它是ES6的标准，兼容IE9，主流浏览器也都支持，MDN，本文将以Object.getPrototypeOf(target)指代__proto__。

### 不要再使用__proto__

> 本段摘自阮一峰-ES6入门，具体解析请点击链接查看
  __proto__属性没有写入 ES6 的正文，而是写入了附录。  
  原因是它本质上是一个内部属性，而不是一个正式的对外的 API，只是由于浏览器广泛支持，才被加入了 ES6。
  标准明确规定，只有浏览器必须部署这个属性，其他运行环境不一定需要部署，而且新的代码最好认为这个属性是不存在的。
  所以无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，应该使用：Object.getPrototypeOf(target)（读操作）、Object.setPrototypeOf(target)（写操作）、Object.create(target)（生成操作）代替

### 构造函数是什么、它做了什么

> 出自《你不知道的js》：在js中, 实际上并不存在所谓的'构造函数'，只有对于函数的'构造调用'。
上文一直提到构造函数，所谓的构造函数，实际上就是通过关键字new来调用的函数：

```javascript
let newObj = new someFn() // 构造调用函数
```

#### 构造/new调用函数的时候做了什么

创建一个全新的对象。
这个新对象的原型(Object.getPrototypeOf(target))指向构造函数的prototype对象。
该函数的this会绑定在新创建的对象上。
如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。
我们称这个新对象为构造函数的实例。

##### 原型继承就是利用构造调用函数的特性

```javascript
SubType.prototype = new SuperType();  // 原型继承：SubType继承SuperType
SubType.prototype.constructor = SubType // 重新指定constructor指向 方便找到构造函数
// 挂载SuperType的this和prototype的属性和方法到SubType.prototype上
```

构造调用的第二点：将新对象的Object.getPrototypeOf(target)指向函数的prototype
构造调用的第三点：该函数的this会绑定在新创建的对象上。(所以父类this声明的属性被所有子类实例共享)
新对象赋值给SubType.prototype

### 原型链是什么

```javascript
function foo() { }
const newObj = new foo() // 构造调用foo 返回一个新对象
const newObj__proto__ = Object.getPrototypeOf(newObj) // 获取newObj的原型对象
newObj__proto__ === foo.prototype // true 验证newObj的原型指向foo
const foo__proto__ = Object.getPrototypeOf(foo.prototype) // 获取foo.prototype的原型
foo__proto__ === Object.prototype // true foo.prototype的原型是Object.prototype
```

如果用以前的语法，从newObj查找foo的原型，是这样的：

```javascript
newObj.__proto__.__proto__ // 这种关系就是原型链
```

可以用以下三句话来理解原型链：

每个对象都拥有一个原型对象: newObj的原型是foo.prototype。
对象的原型可能也是继承其他原型对象的: foo.prototype也有它的原型Object.prototype。
一层一层的，以此类推，这种关系就是原型链。

#### 一个对象是否在另一个对象的原型链上

如果一个对象存在另一个对象的原型链上，我们可以说：它们是继承关系。
判断方式有两种，但都是根据构造函数的prototype是否在原型链上来判断的：

instanceof : 用于测试构造函数的prototype属性是否出现在对象的原型链中的任何位置
语法：object instanceof constructor

```javascript
let test = function () { }
let testObject = new test();
testObject instanceof test // true test.prototype在testObject的原型链上
 testObject instanceof Function // false Function.prototype 不在testObject的原型链上
testObject instanceof Object // true Object.prototype在testObject的原型链上
```

isPrototypeOf ：测试一个对象是否存在于另一个对象的原型链上

语法：prototypeObj.isPrototypeOf(object)

```javascript
let test = function () { }
let testObject = new test();
test.prototype.isPrototypeOf(testObject) // true test.prototype在testObject的原型链上
Object.prototype.isPrototypeOf(testObject) // true Object.prototype在testObject的原型链上
```

### 原型链的终点: Object.prototype

Object.prototype是原型链的终点，所有对象都是从它继承了方法和属性。

Object.prototype没有原型对象：

```javascript
const proto = Object.getPrototypeOf(Object.prototype) // null
```

下面是两个验证例子，有疑虑的同学多写几个测试用例印证一下。

字符串原型链的终点：Object.prototype

```javascript
let test = '由String函数构造出来的'
let stringPrototype = Object.getPrototypeOf(test) // 字符串的原型
stringPrototype === String.prototype // true 字符串的原型是String对象
Object.getPrototypeOf(stringPrototype) === Object.prototype // true String对象的原型是Object对象
```

函数原型链的终点:Object.prototype

```javascript
let test = function () { }
let fnPrototype = Object.getPrototypeOf(test)
fnPrototype === Function.prototype // true test的原型是Function.prototype
Object.getPrototypeOf(Function.prototype) === Object.prototype // true
```

### 原型链用来做什么？

属性查找：
如果试图访问对象(实例instance)的某个属性,会首先在对象内部寻找该属性,直至找不到,然后才在该对象的原型(instance.prototype)里去找这个属性，以此类推
我们用一个例子来形象说明一下：

```javascript
let test = '由String函数构造出来的'
let stringPrototype = Object.getPrototypeOf(test) // 字符串的原型
stringPrototype === String.prototype // true 字符串的原型是String对象
Object.getPrototypeOf(stringPrototype) === Object.prototype // true String对象的原型是Object对象
```

当你访问test的某个属性时，浏览器会进行以下查找：

> 浏览器首先查找test 本身
接着查找它的原型对象：String.prototype
最后查找String.prototype的原型对象：Object.prototype
一旦在原型链上找到该属性，就会立即返回该属性，停止查找。
原型链上的原型都没有找到的话，返回undefiend
这种查找机制还解释了字符串为何会有自带的方法: slice/split/indexOf等。

准确的说：

这些属性和方法是定义在String这个全局对象/函数上的。
字符串的原型指向了String函数的prototype。
之后通过查找原型链，在String函数的prototype中找到这些属性和方法。

### 拒绝查找原型链

hasOwnProperty: 指示对象自身属性中是否具有指定的属性

语法：obj.hasOwnProperty(prop)

参数: prop 要查找的属性

返回值: 用来判断某个对象是否含有指定的属性的Boolean。

```javascript
let test ={ 'OBKoro1': '扣肉' }
test.hasOwnProperty('OBKoro1');  // true
test.hasOwnProperty('toString'); // false test本身没查找到toString 
```

这个API是挂载在object.prototype上，所有对象都可以使用，API会忽略掉那些从原型链上继承到的属性。

### 实例的属性

> 你知道构造函数的实例对象上有哪些属性吗？这些属性分别挂载在哪个地方？原因是什么？

```javascript
function foo() {
    this.some = '222'
    let ccc = 'ccc'
    foo.obkoro1 = 'obkoro1'
    foo.prototype.a = 'aaa'
}
foo.koro = '扣肉'
foo.prototype.test = 'test'
let foo1 = new foo() // `foo1`上有哪些属性,这些属性分别挂载在哪个地方
foo.prototype.test = 'test2' // 重新赋值
```

> prototype是函数的原型对象，即prototype是一个对象，它会被对应的__proto__引用  

> 要知道自己的__proto__引用了哪个prototype，只需要看看是哪个构造函数构造了你，那你的__proto__就是那个构造函数的prototype。  

> 所有的构造函数的原型链最后都会引用Object构造函数的原型，即可以理解Object构造函数的原型是所有原型链的最底层，即Object.prototype. __proto===null
