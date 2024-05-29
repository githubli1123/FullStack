[利用好浏览器的空闲时间 --- requestIdleCallback](https://www.cnblogs.com/Wayou/p/requestIdleCallback.html)

# [利用好浏览器的空闲时间 --- requestIdleCallback](https://www.cnblogs.com/Wayou/p/requestIdleCallback.html)

页面流畅与 FPS页面是一帧一帧绘制出来的，当每秒绘制的帧数（FPS）达到 60 时，页面是流畅的，小于这个值时，用户会感觉到卡顿。1s 60帧，所以每一帧分到的时间是 1000/60 ≈ 16 ms。所以我们书写代码时力求不让一帧的工作量超过 16ms。Frame那么浏览器每一帧都需要完成哪些工作？[![image](https://user-images.githubusercontent.com/3783096/51423451-4a5f1f80-1bfb-11e9-8c0a-597f0d52f4c0.png)](https://user-images.githubusercontent.com/3783096/51423451-4a5f1f80-1bfb-11e9-8c0a-597f0d52f4c0.png) *浏览器一帧内的工作*通过上图可看到，一帧内需要完成如下六个步骤的任务：处理用户的交互JS 解析执行帧开始。窗口尺寸变更，页面滚去等的处理rAF布局绘制	上面六个步骤完成后没超过 16 ms，说明时间有富余，此时就会执行 `requestIdleCallback` 里注册的任务。

![](https://user-images.githubusercontent.com/3783096/51231779-9b72d780-199f-11e9-8e65-eb9df90921ce.png)

