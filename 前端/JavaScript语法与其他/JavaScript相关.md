## JS执行上下文与作用域

对于学习JavaScript语言时，我们一般都是从基本语法学起，此时我们需要了解浏览器是如何逐步执行的。

对于执行上下文和作用域应该是大家最容易混淆的两个概念。



### 🌟执行上下文 Execution Context

JavaScript代码的整个执行过程，分为两个阶段，代码编译阶段与代码执行阶段。编译阶段由编译器完成，将代码翻译成可执行代码，这个阶段作用域规则会确定。执行阶段由引擎完成，**主要任务是执行可执行代码，执行上下文在这个阶段创建**。

![image-20230921164948995](C:\Users\123\AppData\Roaming\Typora\typora-user-images\image-20230921164948995.png)

当一段 JavaScript 代码在运行的时候，它实际上是运行在**执行上下文**中。下面 3 种类型的代码会创建一个新的执行上下文：

- 全局上下文是为运行代码主体而创建的执行上下文，也就是说，它是为那些存在于 JavaScript 函数之外的任何代码而创建的。
- 每个函数会在执行的时候创建自己的执行上下文。这个上下文就是通常说的“本地上下文”。
- 使用 [`eval()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval) 函数也会创建一个新的执行上下文。
- 进入 module 模块代码时会创建一个新的执行上下文。（ES6+规定？）

每一个上下文在本质上都是一种作用域层级。每个代码段开始执行的时候都会创建一个新的上下文来运行它，并且在代码退出的时候销毁掉。

**执行栈 Execution Context Stack**

- 执行栈栈顶的执行上下文称为当前执行上下文
- JS代码总是在当前上下文中运行
- 意思是JS代码中需要用到的资源，到当前执行上下文上查找



### 🌟作用域 Scope

MDN文档中如下说明：https://developer.mozilla.org/zh-CN/docs/Glossary/Scope

JavaScript 的作用域分以下三种：

- 全局作用域：脚本模式运行所有代码的默认作用域

- 模块作用域：模块模式中运行代码的作用域

- 函数作用域：由[函数](https://developer.mozilla.org/zh-CN/docs/Glossary/Function)创建的作用域

  ----

  （此外，用 [`let`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let) 或 [`const`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const) 声明的变量属于额外的作用域）

  - 块级作用域：用一对花括号（一个[代码块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/block)）创建出来的作用域



### 🌟引擎解析原则

变量声明与初始化原则：

1. 所有 var 声明的**非函数中**的变量和 function 声明的会创建在全局对象中，即 this 指向的引用的全局对象中，初始化赋值为 undefined；
2. 顶级 let const class 声明的变量会创建在 全局scope 中，但不会初始化；
3. 命名重复处理：合法情况只有 var 声明的 function 会覆盖 var 声明的非函数变量。

案例1：

![image-20230921170904609](C:\Users\123\AppData\Roaming\Typora\typora-user-images\image-20230921170904609.png)

案例2：

![image-20230921173124610](C:\Users\123\AppData\Roaming\Typora\typora-user-images\image-20230921173124610.png)

![image-20230926163508238](C:\Users\123\AppData\Roaming\Typora\typora-user-images\image-20230926163508238.png)

由此可见：

- 作用域是解析(查找)变量名的一个集合，就是当前运行上下文(也可以是当前上下文的词法环境(Lexical Environment）
  全局作用域就是全局运行上下文
  函数作用域就是函数运行上下文
- 函数调用时的执行上下文看“身世”——函数在哪里创建，就保存哪里的运行上下文
  函数的作用域是在函数创建的时候决定的而不是调用的时候决定

案例3

![image-20230926164641276](C:\Users\123\AppData\Roaming\Typora\typora-user-images\image-20230926164641276.png)

并非根据调用嵌套形成(运行上下文）作用域链，而是根据函数创建嵌套形成作用域链，也就是函数的书写位置形成作用域链,因此称为词法作用域





## 引入 js 与 module 的相关问题

```html
<script src='./index.js'></script>
<script src='./index.js' type="module"></script>
```

