---
title: 强大的数组
date: 2022-02-06
categories:
  - 核心知识
tags:
  - JS基础
---

## 基本语法

> 在前端日常开发中，数组被使用得非常频繁。对数组各种常见方法充分掌握后，能有效提升工作效率。

数组是类似列表的高阶对象，JavaScript 标准内置对象之一 Array 对象用于构造一个数组。

数组有三种创建方法：

```JavaScript
//第一种 字面量
var arr0 = [element0, element1, ..., elementN]
//第二种 构造函数
var arr1 = new Array(element0, element1[, ...[, elementN]])
//第三种 构造函数
var arr2 = new Array(arrayLength)
```

#### 参数说明

#### elementN

Array 构造器会根据给定的元素创建一个 JavaScript 数组，但是当仅有一个参数且为数字时除外（详见下面的 arrayLength 参数）。注意，后面这种情况仅适用于用 Array 构造器创建数组，而不适用于用方括号创建的数组字面量。

#### arrayLength

一个范围在 0 到 2^32-1 之间的整数，此时将返回一个 length 的值等于 arrayLength 的数组对象（言外之意就是该数组此时并没有包含任何实际的元素，不能理所当然地认为它包含 arrayLength 个值为 undefined 的元素）。如果传入的参数不是有效值，则会抛出 RangeError 异常。

## 遍历数组

当面对一个数组的时候，我们经常需要对它进行遍历，从而让我们能够方便地对立面的每个元素进行操作。在开始正式内容之前，先来看看数组可以通过哪些方式进行遍历。

首先会想到 for 循环，通过声明一个变量作为下标能够方便地对所有元素进行操作。说到循环，那么其他的循环，比如 when 当然也是没问题的；通过下标的迭代，我们还可以使用递归来进行遍历。当我们着眼于 Array 本身时，我们会发现，在其原型链上为我们提供的 forEach 和 map 方法也能够对数组进行遍历。

那么下面，我们就来对上面说的几种方法中的三种：for、forEach、map 进行一下剖析。

```JavaScript
const arr = [0,1,2,3,4,5,6,7,8,9]

// for 循环
// 括号中第一个表达式 i 为迭代变量，第二个表达式为循环条件，第三个表达式更新迭代变量
for(let i = 0; i < arr.length; i ++) {...}

// forEach 遍历
// 必须传入一个回调函数作为第一个参数，该回调函数接受多个参数，第一个参数为当前数组遍历到的元素
arr.forEach(item => {...})

// map 遍历
// 必须传入一个回调函数作为第一个参数，该回调函数接受多个参数，第一个参数为当前数组遍历到的元素
arr.map(item => {...})
```

从上面代码中可以发现，除了 for 循环以外，另外两种遍历似乎用法差不多，那是不是这两者可以通用，它们之间有没有差别呢？下面开始分析三种遍历方式的异同。

### 1. for

for 循环的遍历方式与另外两者的差别是最大的，通过代码块来执行循环。在代码块中，需要通过迭代变量来获取当前遍历的元素，如 arr[i]。

看上去通过迭代变量获取元素没有另外两种方式（能够直接获取）方便，但是在某些情况下，我们却不得不使用 for 循环：<b>当在循环满足特定条件时跳出循环体，或跳出本次循环直接进行下一次循环。</b>

```JavaScript
let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
for (let i = 0; i < arr.length; i++) {
  // 当迭代变量 i == 3 时，跳过此次循环直接进入下一次
  if (i == 3) continue;
  console.log(arr[i]);
  // 当 i > 7 时，跳出循环
  if (i > 7) break;
}

//>> 0
//>> 1
//>> 2
//>> 4
//>> 5
//>> 6
//>> 7
//>> 8
```

另外两种遍历方式，由于是通过回调函数的方式对遍历到的元素进行操作，即使在回调函数中 return ，也仅能够跳出当前的回调函数，无法阻止遍历本身的暂停。

```JavaScript
let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
arr.forEach(item => {
  console.log(item);
  if (item > 3) return; // 遍历并没有在大于 3 时结束
});

//>> 0
//>> 1
//>> 2
//>> 3
//>> 4
//>> 5
//>> 6
//>> 7
//>> 8
//>> 9
```

### 2. forEach

forEach() 方法对数组的每个项执行一次提供的回调函数。

语法如下：

```JavaScript
arr.forEach(callback[, thisArg]);
```

#### 参数说明

callback 为数组中每个元素执行的函数，该函数接收三个参数：

- currentValue 数组中正在处理的当前元素。
- index 可选，数组中正在处理的当前元素的索引。
- array 可选，forEach() 方法正在操作的数组。

thisArg 可选参数。当执行回调函数时用作 this 的值(参考对象)。

由于匿名函数的 this 指向始终为 全局 window 对象，然而某些情况下，我们需要改变 this 的指向，此时 thisArg 这个参数的作用就凸显出来了。

```JavaScript
var a = "coffe";
var b = {a:"1891"};
(function() {
  let arr = [0, 1, 2];
  arr.forEach(function(item){
    console.log(this.a);//这里是访问的b.a
  },b);//这里把b作为thisArg参数传入之后，this就指向了b
})();

//>> 1891
//>> 1891
//>> 1891

```

> 注 意：
> 如果使用箭头函数表达式来传入 thisArg 参数会被忽略，因为箭头函数在词法上绑定了 this 值。

```JavaScript
var a = "coffe";
var b = {a:"1891"};
(function() {
  let arr = [0, 1, 2];
  arr.forEach((item)=>{
    console.log(this.a);//这里是访问的window.a
  },b);//这里把b作为thisArg参数传入之后，本来this就应指向b，但由于使用了箭头函数表达式，
       //this固定指向包含它的函数的外层作用域（也即匿名函数）的this，也即window
})();

//>> coffe
//>> coffe
//>> coffe
```

### 3. map

map 的使用与 forEach 几乎一致，唯一的区别是：map 会返回一个新的数组，而这个数组的元素是回调函数的返回值，所以我们可以用一个变量接收 map 的返回值。

```JavaScript
let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const arr1 = arr.map(item => item + 1);
console.log(arr1);
//>> [1,2,3,4,5,6,7,8,9,10]

const arr2 = arr.map(item => {item + 1});//注意这个回调箭头函数并没有返回值
console.log(arr2);
//输出一个数组项都为undefined的数组
//>> [undefined, undefined, …… undefined]
```

上面的代码中，arr1 将回调函数的返回值 item + 1 作为了数组中的元素，而 arr2 由于回调函数没有返回值，所以创建了一个每项都为 undefined 的数组。

### 4.for...in 与 for...of

for...in 遍历的是数组项的索引，而 for...of 遍历的是数组项的值。for...of 遍历的只是数组内的项，而不包括数组的原型属性、方法，以及索引。

```JavaScript
Array.prototype.getLength = function () {
   return this.length;
}
var arr = [1, 2, 4, 5, 6, 7]
arr.name = "coffe1981";
console.log("-------for...of--------");
for (var value of arr) {
   console.log(value);
}
console.log("-------for...in--------");
for (var key in arr) {
   console.log(key);
}

//>>    -------for...of--------
//>>    1
//>>    2
//>>    4
//>>    5
//>>    6
//>>    7
//>>    -------for...in--------
//>>    0
//>>    1
//>>    2
//>>    3
//>>    4
//>>    5
//>>    name
//>>    getLength
```

如上代码，会发现 for...in 可以遍历到原型上的属性和方法，如果不想遍历原型的属性和方法，则可以在循环内部用 hasOwnPropery 方法判断某属性是否是该对象的实例属性

```JavaScript
Array.prototype.getLength = function () {
   return this.length;
}
var arr = [1, 2, 4, 5, 6, 7]
arr.name = "coffe1981";
console.log("-------for...in--------");
for (var key in arr) {
   if(arr.hasOwnProperty(key))
      console.log(key);
}
//>>    -------for...in--------
//>>    0
//>>    1
//>>    2
//>>    3
//>>    4
//>>    5
//>>    name
```

#### 总结

for..of 适用遍历数组/类数组对象/字符串/map/set 等拥有迭代器对象的集合，但是不能遍历对象，因为没有迭代器对象。遍历对象通常用 for...in 来遍历对象的键名。  
与 forEach 不同的是，for...of 和 for...in 都可以正确响应 break、continue 和 return 语句。

## 过滤方法 filter

filter() 方法返回一个新数组，其包含通过回调函数测试的所有数组项。

语法如下：

```JavaScript
var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])
```

#### 参数说明

callback 用来测试数组的每个元素的函数。返回 true 表示该元素通过测试，保留该元素，false 则不保留。它接受以下三个参数:

- element 数组中当前正在处理的元素。
- index 可选，正在处理的元素在数组中的索引。
- array 可选，调用了 filter 的数组本身。

thisArg 可选参数。执行 callback 时，用于指定 this 的值。

```JavaScript
const arr1 = [1, 4, 5, 6, 2, 3, 8, 9, 0];

const arr2 = arr1.filter((item, index, array) => {
  return item > 5;
});
console.log(arr2);//>> [6, 8, 9]
```

在上面的代码中，只要当前的数组项的值大于 5 ，item > 5 就会返回 true ，则会通过回调函数的测试，从而将该数组项保留，因此将原数组过滤后返回的新数组是[6, 8, 9]。

## 查找方法 find

find() 方法返回数组中通过回调函数测试的第一个数组项的值，如果没有通过测试则返回 undefined。

语法如下：

```JavaScript
var item = arr.find(callback(element[, index[, array]])[, thisArg])
```

参数说明与上面的 filter 一致，就不再赘述。示例代码如下：

```JavaScript
let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const value = arr.find((item, index, array) => {
    return item > 5
});
console.log(value); //>> 6
```

需要注意的是，一旦回调函数测试通过（返回了 true） ，则 find 方法会立即返回当前数组项 item 的值；如果没有符合规则的数组项，则会返回 undefined。

与 find 类似的方法是 findIndex() 方法，区别在于 find 返回元素的值，而 findIndex 则返回数组项的下标（索引）。

### some

some() 方法测试数组中是不是有数组项通过了回调函数的测试，返回一个 Boolean 类型的值。

语法如下：

```JavaScript
arr.some(callback(element[, index[, array]])[, thisArg])
```

参数说明与上面的 filter 一致。

> 注意：如果用一个空数组进行测试，在任何情况下它返回的都是 false。

示例代码如下：

```JavaScript
let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const isTrue = arr.some((item, index, array) => {
  return item > 5;
});
console.log(isTrue); //>> true
```

与 fitler 和 find 相比，除了有返回值的区别，还有一个区别：如果原数组中存在被删除或者没有被赋值的索引，则回调函数在该数组项上不会被调用。是不是有点费解？看个代码示例就清楚了。

```JavaScript
const arr = new Array(4);
arr[0] = 1;
const isTrue = arr.some((item) => {
    return item > 5;
});
console.log(isTrue); //>> false
```

在上面的例子中，虽然 arr.length 为 4 ，但是回调函数只在索引为 0 的项上被调用了，后面的三项由于未被赋值，所以不调用回调函数。

### sort

sort() 方法用原地算法对数组项进行排序，并返回数组。默认排序顺序是在将数组项转换为字符串，然后比较它们的 UTF-16 代码单元值。

> 原地算法（in-place algorithm）是一种使用小的、固定数量的额外空间来转换资料的算法，不随着算法执行而逐渐扩大额外空间的占用。当算法执行时，输入的资料通常会被要输出的部份覆盖掉。

由于排序取决于具体实现，因此无法保证排序的时间和空间复杂度

#### 语法如下

```JavaScript
var newArray = arr.sort([compareFunction]);
```

#### 参数说明

compareFunction 可选，用来指定按某种顺序进行排列的函数。如果省略，元素按照转换为的字符串的各个字符的 Unicode 位点进行排序。

- firstEl 第一个用于比较的元素。
- secondEl 第二个用于比较的元素。

示例代码如下：

```JavaScript
let arr = [1, 4, 5, 6, 2, 3, 8, 9, 0];
arr.sort((a, b) => {
  return a - b;
});
console.log(arr);
//>> [0, 1, 2, 3, 4, 5, 6, 8, 9]
```

sort 方法接收一个用于比较的回调函数，这个函数有两个参数，分别代表将要被比较的数组中的两个项，同时这两个数组项会按照回调函数的返回值进行排序：

- 如果返回值小于 0 ，a 会被排在 b 之前；
- 如果返回值大于 0 ，b 会被排在 a 之前；
- 如果相等 ， 则 a 和 b 的相对位置不变。

对于数字的升序排序，可以像下面这样写回调函数：

```JavaScript
(a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}
```

将上面的代码精简下，就会变成 return a - b。

所以对于数字的排列，升序返回 return a - b，降序返回 return b - a。

由于回调函数中的 a 和 b 分别是将要被比较的两个数组项，如果数组项是对象类型，也可以通过对象中的属性进行排序。

> 注意：
> sort 方法如果不传入比较的回调函数，那么它将会根据字符的 Unicode 位点进行排序。

```JavaScript
let arr = [2, 40, 11, 5, 10];
console.log(arr.sort());
//>> [10, 11, 2, 40, 5]
```

上面的例子中， sort 没传入比较的回调函数，它会根据每个数组项的第一个字符进行排序，由于在 Unicode 中，1 在 2 之前，所以 10 会排在 2 之前，而不是根据数字 10 和 2 的大小来比较。如果两个数组项的第一个字符相同，则根据第二个字符对比排序。

### reduce

reduce() 方法对数组中的每个项执行一个由您提供的 callback 函数，将其结果汇总为单个值返回。

语法如下：

```JavaScript
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

参数说明：

callback 执行数组中每个值的函数，包含四个参数：

- accumulator \*\*累计器，累计回调的返回值。它是上一次调用回调时返回的累积值，或 initialValue（见于下方）。
- currentValue 数组中正在处理的元素。
- currentIndex 可选，数组中正在处理的当前元素的索引。 如果提供了 initialValue，则起始索引号为 0，否则为 1。
- array 可选调用 reduce()的数组

initialValue 可选作为第一次调用 callback 函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素（也即针对数组的 arr 循环计算少一次，千万要注意这点）。 在没有初始值的空数组上调用 reduce 将报错。

reduce 的定义比较抽象，平时开发中用的相对比较少，但若用好之后，能大大提升工作效率，所以这里我们重点介绍一下几种常见的用法示例。

### 1. 将一个数组类型转换成一个对象

我们可以使用 reduce()来转换一个数组，使之成为一个对象。如果你想要做查询和分类，这个方法将非常有用。举一个例子，想象一下我们有以下 peopleArr 数组：

```JavaScript
const arr  = [
    {
        username:    'makai',
        displayname: '馆长',
        email:       'guanzhang@coffe1891.com'
    },
    {
        username:    'xiaoer',
        displayname: '小二',
        email:       'xiaoer@coffe1891.com'
    },
    {
        username:    'zhanggui',
        displayname: '掌柜',
        email:       null
    },
];
```

在有些情况下，我们需要通过 username 来查询详细 people 详情，通常为了方便查询，我们需要将 array 转换成 object。那么，通过使用 reduce()方法，我们可以使用下面这种方法：

```JavaScript
function callback(acc, person) {
    //下面这句用到了扩展运算符...acc，表示把acc对象的属性“肢解”开，和新的属性一起
    //以一个新的对象返回
    return {...acc, [person.username]: person};
}
const obj = arr.reduce(callback, {});//这里的初始值为{}
console.log(obj);
//>> {
//     "makai": {
//         "username":    "makai",
//         "displayname": "馆长",
//         "email":       "guanzhang@coffe1891.com"
//     },
//     "xiaoer": {
//         "username":    "xiaoer",
//         "displayname": "小二",
//         "email":       "xiaoer@coffe1891.com"
//     },
//     "zhanggui":{
//         "username":    "zhanggui",
//         "displayname": "掌柜",
//         "email":       null
//     }
// }
```

### 2. 展开一个超大的 array

通常我们会认为 reduce()是用来精简一组数据的，来得到一个更简单的结果，这个简单结果当然也可以是一个数组。由于也从来没有明文规定说这个结果（数组）必须要比原来的的数组长度要小。所以，我们可以使用 reduce()来把一个较短的数组转换成一个较长的数组。 当你需要从一个 text 文件里面去读取数据的时候，这种方法非常有用。下面是例子。假设我们已经读取到一系列简单文本数据，然后放入了一个数组。我们的需求是用逗号把它们分割，然后得到一个大的 name 列表。

```JavaScript
const arr = [
  "Algar,Bardle,Mr. Barker,Barton",
  "Baynes,Bradstreet,Sam Brown",
  "Monsieur Dubugue,Birdy Edwards,Forbes,Forrester",
  "Gregory,Tobias Gregson,Hill",
  "Stanley Hopkins,Athelney Jones"
];

function callback(acc, line) {
  return acc.concat(line.split(/,/g));
}
const arr1 = arr.reduce(callback, []);
console.log(arr1);
//>> [
//   "Algar",
//   "Bardle",
//   "Mr. Barker",
//   "Barton",
//   "Baynes",
//   "Bradstreet",
//   "Sam Brown",
//   "Monsieur Dubugue",
//   "Birdy Edwards",
//   "Forbes",
//   "Forrester",
//   "Gregory",
//   "Tobias Gregson",
//   "Hill",
//   "Stanley Hopkins",
//   "Athelney Jones"
// ]
```

上面代码把一个 length 为 5 的数组，展开成了 length 为 16 的数组。

### 3. 完成对数组的两次计算，但只遍历一次

有时候我们需要对一个简单数组进行两次运算。比如计算出一组数字中的最大值和最小值。通常我们使用以下这种遍历两次的方法：

```JavaScript
const arr = [0.3, 1.2, 3.4, 0.2, 3.2, 5.5, 0.4];
const maxReading = arr.reduce((x, y) => Math.max(x, y), Number.MIN_VALUE);
const minReading = arr.reduce((x, y) => Math.min(x, y), Number.MAX_VALUE);
console.log({minReading, maxReading});
//>> {minReading: 0.2, maxReading: 5.5}
```

这种方法需要遍历两次数组。但是，现在有了一种不需要遍历次数这么多的方法。自从 reduce()方法可以返回各种我们需要的类型。我们可以把两个值塞进同一个对象。这样我们就可以只遍历一次数组就可以做两次计算了。代码如下：

```JavaScript
const arr = [0.3, 1.2, 3.4, 0.2, 3.2, 5.5, 0.4];
function callback(acc, reading) {
    return {
        minReading: Math.min(acc.minReading, reading),
        maxReading: Math.max(acc.maxReading, reading),
    };
}
const initMinMax = {
    minReading: Number.MAX_VALUE,
    maxReading: Number.MIN_VALUE
};
const result = arr.reduce(callback, initMinMax);
console.log(result);
//>> {minReading: 0.2, maxReading: 5.5}
```

### 4. 在一次调用动作里，同时实现 mapping 和 filter 的功能

假设我们有一个跟上文相同的 peopleArr 数组。我们现在要找出最近的登陆用户，并且去掉没有 email 地址的。一般情况下，我们通常使用下面这三个步骤的方法：

1. 过滤掉所有没有 email 的对象；
2. 提取最近的对象；
3. 找出最大值。

放在一起我们可以得到如下代码：

```JavaScript
function notEmptyEmail(x) {
   return (x.email !== null) && (x.email !== undefined);
}

function getLastSeen(x) {
    return x.lastSeen;
}

function greater(a, b) {
    return (a > b) ? a : b;
}

const peopleWithEmail = peopleArr.filter(notEmptyEmail);
const lastSeenDates   = peopleWithEmail.map(getLastSeen);
const mostRecent      = lastSeenDates.reduce(greater, '');

console.log(mostRecent);
//>> 2019-05-13T11:07:22+00:00
```

以上代码既兼顾了功能也拥有良好的可读性，同时对于简单的数据，可以运行良好。但是如果我们有一个巨大的数组，我们就有可能会碰上内存问题了。这是因为我们使用变量去储存了每一个中间数组。如果我们对 reducer callback 方法做一些改动，我们就可以一次性完成以上三步工作了。

```JavaScript
function notEmptyEmail(x) {
   return (x.email !== null) && (x.email !== undefined);
}

function greater(a, b) {
    return (a > b) ? a : b;
}
function notEmptyMostRecent(currentRecent, person) {
    return (notEmptyEmail(person))
        ? greater(currentRecent, person.lastSeen)
        : currentRecent;
}

let result = peopleArr.reduce(notEmptyMostRecent, '');

console.log(result);
//>> 2019-05-13T11:07:22+00:00
```

以上使用 reduce()的代码仅仅只遍历了数组一次，极大地提升了性能。但是在数据量小的情况下，这种方法的性能优势不突出。

### 5. 运行异步方法队列

我们还可以做的一个操作是使用 reduce()，可以在一个队列里面串联运行 promise（相对于并行运行 promise）。当需要请求一系列有速度限制的 API，同时希望每个请求接连串来，上一个请求完成后才发出下一个请求的时候，下面这种方法就非常有用了。为了举一个例子，我们假设要从服务器取回 peopleArr 数组中的每一个 people 的消息。我们可以这样做：

```JavaScript
function fetchMessages(username) {
    return fetch(`https://example.com/api/messages/${username}`)
        .then(response => response.json());
}

function getUsername(person) {
    return person.username;
}

async function chainedFetchMessages(p, username) {
    // 在这个函数体内, p 是一个promise对象，等待它执行完毕,
    // 然后运行 fetchMessages().
    const obj  = await p;
    const data = await fetchMessages(username);
    return { ...obj, [username]: data};
}

const msgObj = peopleArr
    .map(getUsername)
    .reduce(chainedFetchMessages, Promise.resolve({}))
    .then(console.log);
//>> {glestrade: [ … ], mholmes: [ … ], iadler: [ … ]}
```

注意这段代码的逻辑，我们必须通过 promise.resolve()调用 promise 回调函数，作为 reducer 的初始值。它会立刻调用 resolve 方法，这样一连串的 API 请求就开始接连运行了。
