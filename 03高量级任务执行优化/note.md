页面卡顿的原因是因为JS执行线程占用了控制权，导致UI线程无法工作。（这需要去了解浏览器工作原理）在浏览器的事件轮询（EventLoop）机制中，每一个宏任务执行完之后会将控制权重新交给UI线程，待UI线程执行完渲染任务后，才会继续执行下一个宏任务。

> UI线程的职能是什么？



直接执行：阻塞







对于 时间分片文件夹 中的 02函数改造 方案：

我感觉困惑的一点。performance.now() 方法返回一个精确到毫秒的时间戳，和 JavaScript 中其他可用的时间类函数（比如[`Date.now`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now)）不同的是，`window.performance.now()`返回的时间戳没有被限制在一毫秒的精确度内，相反，它们以浮点数的形式表示时间，精度最高可达微秒级。

另外一个不同点是，`window.performance.now()`是以一个恒定的速率慢慢增加的，它不会受到系统时间的影响（系统时钟可能会被手动调整或被 NTP 等软件篡改）。另外，`performance.timing.navigationStart + performance.now()` 约等于 `Date.now()`。

那么在随着每一帧可用时间的逐渐减少，耗时任务是会准时在3s后执行完，还是说需要耗时任务持续3s后执行完。毕竟这个 performance.now() 方法返回的时间戳不会因为每一帧可用时间的减少而变慢，是恒定增加的。
