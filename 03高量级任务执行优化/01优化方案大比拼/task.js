// 模拟耗时操作，大概10ms
function myFunc() {
    const startTime = Date.now();
    while (Date.now() - startTime < 10) {}
  }
  
  // 循环执行300次
  for (let i = 0; i < 300; i++) {
    myFunc();
  }
  
  // 通知主线程已执行完
  self.postMessage("我执行完啦");
  