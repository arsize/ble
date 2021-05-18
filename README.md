为了简化微信小程序环境下的蓝牙接入流程，经过线上正式项目一年的运行，发现BLE这块API许多坑，且难以移植复用，所以将它封装出来提高可维护性以及可移植性。
### 如何使用
#### 安装Eventenitter
```
npm install eventemitter2 --save
```

### 引入 
在项目根目录utils文件夹下添加如下文件：ble.js、bleHandler.js、tools.js、error.js
完成上面步骤，就可以直接在小程序中使用蓝牙功能了。✨

### 示例
```
const emitter = new EventEmitter2();
const ble = new BLE(blename, emitter)

ble.listen(res => {
	if (res.type == 'connect') {
    switch(res.data){
    	case "未打开适配器"：
        break
      case "蓝牙已连接"：
        break
      case ""
        break
    }
  }else if (res.type == "response") {
     console.log('收到设备消息响应：', res)
    //TODO
  }
})

ble.init()

```

### 实现细节
使用方法如上，很简单，只需要维护一个全局的ble实例，则可以进行蓝牙的各种功能操作。第二部引入的那几个文件是用来干嘛的呢？
大体上将蓝牙的连接、通讯、维护过程按功能的复杂程度分为三层：BLE、BLEHandler、Tool，ble更偏向用户层，blehandler提供一些流程性控制，tool则完全是封装的微信API，隔离一些繁复的工作，使代码看起来简洁一些。

### 流程图

![蓝牙流程图](http://arsizes.com/img/flow.png)
