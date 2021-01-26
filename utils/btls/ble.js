import * as mod from "./mod";

/**
 * 蓝牙连接流程：
 * 1.先初始化蓝牙适配器
 * 2.搜寻附近的蓝牙外围设备
 * 3.获取设备ID
 * 4.停止搜寻
 * 5.开始连接
 * 6.激活特征值
 */

class BLE {
    constructor(blename) {
        this.readCharacteristicId = "";
        this.writeCharacteristicId = "";
        this.notifyCharacteristicId = "";
        this.deviceId = "";
        this.blename = blename;
        this.serviceId = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
    }
    async init() {
        // 蓝牙适配器初始化
        await mod.openAdapter.call(this);
        // 搜索蓝牙设备
        await mod.startSearch.call(this);
        // 获取设备ID
        await mod.onBluetoothFound.call(this);
        // 停止搜索设备
        await mod.stopSearchBluetooth.call(this);
        // // 连接蓝牙
        // connectBlue();
        // // 获取特征值
        // getCharacteristics();
    }
    async send() {}
    async clear() {}
}

export { BLE };
