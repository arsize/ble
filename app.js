import { globalData } from "./utils/global";
const EventEmitter2 = require("./miniprogram_npm/eventemitter2/index").EventEmitter2;
const emitter = new EventEmitter2();

App({
    onLaunch() { },
    globalData: Object.assign(
        {
            ble: "",//全局蓝牙实例
            emitter: emitter, //全局订阅函数
            blueStatus: false
        },
        globalData
    ),
});

