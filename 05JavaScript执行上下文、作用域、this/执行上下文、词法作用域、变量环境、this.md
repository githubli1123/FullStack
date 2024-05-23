唯一真神：https://262.ecma-international.org/6.0/



[this关键字的出现有什么意义？为了解决什么问题？_你对 this 关键字的理解, this可以解决什么样的问题 ?-CSDN博客](https://blog.csdn.net/weixin_43850639/article/details/130652691)

[js执行上下文与作用域 bilibili](https://www.bilibili.com/video/BV1wD4y1D7Pp/?spm_id_from=333.337.search-card.all.click&vd_source=a9caa6410eb2baf51ab8ecfb66da5f53)

[执行上下文、作用域、this值、闭包 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/389974111)

[这篇鸟文，助你彻底玩透执行上下文、调用栈、作用域、变量提升、this值、闭包等王者技能 - 掘金 (juejin.cn)](https://juejin.cn/post/6982447609470255112)

[3月阅读周·你不知道的JavaScript | 无人不识又无人不迷糊的this-云社区-华为云 (huaweicloud.com)](https://bbs.huaweicloud.com/blogs/424323?utm_source=zhihu&utm_medium=bbs-ex&utm_campaign=other&utm_content=content)

[this指向 bilibili](https://www.bilibili.com/video/BV1Jp4y137n2/?spm_id_from=333.337.search-card.all.click&vd_source=a9caa6410eb2baf51ab8ecfb66da5f53)



## 执行上下文相关概念

执行上下文是计算和执行 JavaScript 代码的环境的抽象概念。每当 Javascript 代码在运行的时候，它都是在执行上下文中运行。

### **执行栈**

执行栈，也就是在其它编程语言中所说的“调用栈”，是一种拥有 LIFO（后进先出）的数据结构，被用来存储代码运行时创建的所有执行上下文。当 JavaScript 引擎第一次遇到你的脚本时，它会创建一个全局的执行上下文并且压入当前执行栈。每当引擎遇到一个函数调用，它会为该函数创建一个新的执行上下文并压入栈的顶部。



### 执行上下文所包含的内容

> 执行上下文在不同的版本中定义不同，《重学前端》中对此进行了总结，目前主要有三个版本：

执行上下文在ES3中，包含三个部分。

- scope：作用域，也常常被叫做作用域链。
- variable object：变量对象，用于存储变量的对象。
- this value：this值。



在ES5中，我们改进了命名方式，把执行上下文最初的三个部分改为下面这个样子。

- lexical environment：词法环境，当获取变量时使用。（通过let、const、with（）、try-catch创建的变量存在词法环境中）
- variable environment：变量环境，当声明变量时使用。（通过var声明或function（）{}声明的变量存在变量环境中）
- this value：this值。



在ES2018中，执行上下文又变成了这个样子，this值被归入lexical environment，但是增加了不少内容。

- lexical environment：词法环境，当获取变量或者this值时使用。
- variable environment：变量环境，当声明变量时使用
- code evaluation state：用于恢复代码执行位置。
- Function：执行的任务是函数时使用，表示正在被执行的函数。
- ScriptOrModule：执行的任务是脚本或者模块时使用，表示正在被执行的代码。
- Realm：使用的基础库和内置对象实例。
- Generator：仅生成器上下文有这个属性，表示当前生成器。



### 怎么创建执行上下文？ES6

到现在，我们已经看过 JavaScript 怎样管理执行上下文了，现在让我们了解 JavaScript 引擎是怎样创建执行上下文的。

当 JavaScript 引擎第一次遇到你的脚本时，它会创建一个全局的执行上下文并且压入当前执行栈。每当引擎遇到一个函数调用，它会为该函数创建一个新的执行上下文并压入栈的顶部。

创建执行上下文有两个阶段：**1) 创建阶段** 和 **2) 执行阶段**。



#### 1 创建阶段

在 JavaScript 代码执行前，执行上下文将经历创建阶段。在创建阶段会发生三件事：

1. **this** 值的决定，即我们所熟知的 **this 绑定**。
2. 创建**词法环境**组件。
3. 创建**变量环境**组件。

所以执行上下文在概念上表示如下（数据结构，伪代码）：

```javascript
ExecutionContext = {
  ThisBinding = <this value>,
  LexicalEnvironment = { ... },
  VariableEnvironment = { ... },
}
```

##### 1.1 this 绑定

在全局执行上下文中，`this` 的值指向全局对象。(在浏览器中，`this`引用 window 对象)。

**在函数执行上下文中，`this` 的值取决于该函数是如何被调用的。如果它被一个引用对象调用，那么 `this` 会被设置成那个对象，否则 `this` 的值被设置为全局对象或者 `undefined`（在严格模式下）**。例如：

```javascript
let foo = {
  baz: function() {
  	console.log(this);
  }
}

foo.baz();   // 'this' 引用 'foo', 因为 'baz' 被对象 'foo' 调用

let bar = foo.baz;

bar();       // 'this' 指向全局 window 对象，因为没有指定引用对象
```

##### 1.2 创建**词法环境**组件

词法环境概念和内容

**官方的 ES6** 文档把词法环境定义为

> **词法环境**是一种规范类型，基于 ECMAScript 代码的词法嵌套结构来定义**标识符**和具体变量和函数的关联。一个词法环境由环境记录器和一个可能的引用**outer**词法环境的空值组成。

简单来说**词法环境**是一种持有**标识符—变量映射**的结构。（这里的**标识符**指的是变量/函数的名字，而**变量**是对实际对象[包含函数类型对象]或原始数据的引用）。

现在，在词法环境的**内部**有两个组件：(1) **环境记录器**  (2) 一个**外部环境的引用**。

1. **环境记录器**是存储变量和函数声明的实际位置。
2. **外部环境的引用**意味着它可以访问其父级词法环境（作用域）。

> 译者注：外部环境已经跟 ES3 规定的作用域的作用类似



词法环境、环境记录器的分类

**词法环境**有两种类型：

- **全局环境**（在全局执行上下文中）是没有外部环境引用的词法环境。全局环境的外部环境引用是 **null**。它拥有内建的 Object/Array/等、在环境记录器内的原型函数（关联全局对象，比如 window 对象）还有任何用户定义的全局变量，（后面这个this我感觉不应该出现在这里）并且 `this`的值指向全局对象。
- 在**函数环境**中，函数内部用户定义的变量存储在**环境记录器**中。并且引用的外部环境可能是全局环境，或者任何包含此内部函数的外部函数。

**环境记录器**也有两种类型（如上！）：

1. **对象环境记录器**用来定义出现在**全局上下文**中的变量和函数的关系。
2. **声明式环境记录器**存储变量、函数和参数。

简而言之，

- 在**全局环境**中，环境记录器是对象环境记录器。
- 在**函数环境**中，环境记录器是声明式环境记录器。

**注意：** 对于**函数环境**，**声明式环境记录器**还包含了一个传递给函数的 `arguments` 对象（此[对象存储](https://cloud.tencent.com/product/cos?from_column=20065&from=20065)索引和参数的映射）和传递给函数的参数的 **length**。

抽象地讲，词法环境在伪代码中看起来像这样：

```javascript
GlobalExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
    }
    outer: <null>
  }
}

FunctionExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
    }
    outer: <Global or outer function environment reference>
  }
}
```

##### 1.3 创建变量环境组件

它同样是一个词法环境，其环境记录器持有**变量声明语句**在执行上下文中创建的绑定关系。如上所述，变量环境也是一个词法环境，所以它有着上面定义的词法环境的所有属性。在 ES6 中，**词法环境**组件和**变量环境**的一个不同就是前者被用来存储函数声明和变量（`let` 和 `const`）绑定，而后者只用来存储 `var` 变量绑定。

我们看点样例代码来理解上面的概念：

```javascript
let a = 20;
const b = 30;
var c;

function multiply(e, f) {
 var g = 20;
 return e * f * g;
}

c = multiply(20, 30);
```

执行上下文看起来像这样：

```javascript
GlobalExectionContext = {

  ThisBinding: <Global Object>, // 这个绑定应该是有一些规则存在的

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      a: < uninitialized >,
      b: < uninitialized >,
      multiply: < func >
    }
    outer: <null>
  },

  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      c: undefined,
    }
    outer: <null>
  }
}

FunctionExectionContext = {
	ThisBinding: <Global Object>,

	LexicalEnvironment: {
        EnvironmentRecord: {
          Type: "Declarative",
          // 在这里绑定标识符
          Arguments: {0: 20, 1: 30, length: 2},
        },
        outer: <GlobalLexicalEnvironment> // 可能是引用 GlobalExectionContext.LexicalEnvironment
	},

	VariableEnvironment: {
    	EnvironmentRecord: {
      		Type: "Declarative",
      		// 在这里绑定标识符
      		g: undefined
    	},
    	outer: <GlobalLexicalEnvironment>
  }
}
```

**注意：** 只有遇到调用函数 `multiply` 时，函数执行上下文才会被创建。

可能你已经注意到 `let` 和 `const` 定义的变量并没有关联任何值，但 `var` 定义的变量被设成了 `undefined`。

这是因为在创建阶段时，引擎检查代码找出变量和函数声明，虽然函数声明完全存储在环境中，但是变量最初设置为 `undefined`（`var` 情况下），或者未初始化（`let` 和 `const` 情况下）。

这就是为什么你可以在声明之前访问 `var` 定义的变量（虽然是 `undefined`），但是在声明之前访问 `let` 和 `const` 的变量会得到一个引用错误。

这就是我们说的 **var变量的声明提升** 。

#### 2 执行阶段

这是整篇文章中最简单的部分。在此阶段，完成对所有这些变量的分配，最后执行代码。

**注意：**  在执行阶段，如果 JavaScript 引擎不能在源码中声明的实际位置找到 `let` 变量的值，它会被赋值为 `undefined`。





### 结论

我们已经讨论过 JavaScript 程序内部是如何执行的。虽然要成为一名卓越的 JavaScript 开发者并不需要学会全部这些概念，但是如果对上面概念能有不错的理解将有助于你更轻松，更深入地理解其他概念，如变量声明提升，作用域和闭包。





## this

### 绑定规则

来看看在函数的执行过程中调用位置如何决定this的绑定对象。首先必须找到调用位置，然后判断需要应用下面四条规则中的哪一条。充分理解四条规则之后，再理解多条规则都可用时它们的优先级如何排列。

**1、默认绑定**

首先要介绍的是最常用的函数调用类型：独立函数调用。可以把这条规则看作是无法应用其他规则时的默认规则。

```javascript
var a = 2;

function foo() {
  console.log(this.a);
}

foo(); // 2
```

打印结果是2。也就是当调用foo()时，this.a被解析成了全局变量a。函数调用时应用了this的默认绑定，因此this指向全局对象。

**2、隐式绑定**

另一条需要考虑的规则是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含，不过这种说法可能会造成一些误导。

思考下面的代码：

```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo,
};

obj.foo(); // 2
```

当foo()被调用时，它的前面确实加上了对obj的引用。当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文对象。因为调用foo()时this被绑定到obj，因此this.a和obj.a是一样的。

**3、显式绑定**

JavaScript 提供的绝大多数函数以及你自己创建的所有函数都可以使用call(..)和apply(..)方法。

它们的第一个参数是一个对象，是给this准备的，接着在调用函数时将其绑定到this。

因为可以直接指定this的绑定对象，因此我们称之为显式绑定。

思考下面的代码：

```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
};

foo.call(obj); // 2
```

通过foo.call(..)，我们可以在调用foo时强制把它的this绑定到obj上。

**4、new绑定**

在传统的面向类的语言中，“构造函数”是类中的一些特殊方法，使用new初始化类时会调用类中的构造函数。通常的形式是这样的：

```javascript
something = new MyClass(..);
```

在 JavaScript 中，构造函数只是一些使用 new 操作符时被调用的函数。它们并不会属于某个类，也不会实例化一个类。实际上，它们甚至都不能说是一种特殊的函数类型，它们只是被new操作符调用的普通函数而已。



### 优先级

**1、四条规则的优先级**

new绑定 > 显式绑定 > 隐式绑定 > 默认绑定。



### 题目

**Q1:**

```javascript
function foo() { // 运行在严格模式下，this会绑定到undefined
    "use strict";
    
    console.log( this.a );
}

var a = 2;

foo();

```



```
TypeError: Cannot read property 'a' of undefined
```





```javascript
function foo() {
    console.log( this.a );
}

var a = 2;

(function() { // 严格模式下调用函数则不影响默认绑定
    "use strict";
    
    foo();
})();
```

```
// 2
```



Q

```javascript
function fn(){
    console.log(this);
    console.log(this.toFixed(1));
}
const newFn = fn.bind(1.111);
// console.dir(fn);
// console.dir(newFn);
newFn();
```

```
Number {1.111}

1.1
```







