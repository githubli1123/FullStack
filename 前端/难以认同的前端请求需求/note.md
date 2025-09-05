现在需要快速搭建一个项目，需要克隆以往的项目并且简单修改后给外部展示成果，但是时间太紧，后端没有时间做，于是打算数据放在前端，前端部署项目时把数据也一起部署到服务器上。但是问题在于：现有项目的数据请求模块是基于axios写的，需要一个请求网址。



解决方法：

1. 使用import()动态引入并且支持promise，完美替换（屁嘞）。
2. 数据放在public中，为axios写死一个请求地址。暂未验证是否可行。
2. 数据写在一个js文件或者ts文件中，向外暴露。需要使用这份数据的地方使用import静态导入即可。（可行，目前在使用）



1️⃣对于以上方法，都需要面对一个需求：同时请求多个本地文件。请问如何解决

✅[Promise实现并行调用和顺序调用的方法_多个promise依次调用-CSDN博客](https://blog.csdn.net/weixin_41500253/article/details/115682504)

2️⃣这些本地文件是geojson，会把他们放在gis地图中，cesium中加载这些文件时会把他们单独创建为一个个【不知道叫啥东西】实例，当我需要批量改变这些实体的属性时，需要按照本地文件的代号依次找到这些实体并更改属性。但是现在项目中写这个功能的方法只处理了对一个【图层】进行查找的逻辑，没有对于数组传参的处理。

✅感觉像是代码功能设计方面出现了问题。查找【图层】和修改【图层】的逻辑应该分开，在需要的地方再组合使用。



碰到的问题：

对比下面两个

```
    function getlayerInOneMap_agile_promise(type: string) {
        let promise = new Promise(function (resolve, reject) {
            let data = getlayerInOneMap_agile(type); console.log(data)
            if (data !== null || data !== undefined) {
                resolve(data)
            } else {
                reject(data)
            }
        });
        return promise;
    }
```

```
    function getlayerInOneMap_agile_promise(type: string) {
        let promise = new Promise(function (resolve, reject) {
            let data = getlayerInOneMap_agile(type); console.log(data)
            if (data !== null || data !== undefined) {
                resolve({data})
            } else {
                reject({data})
            }
        });
        return promise;
    }
```





