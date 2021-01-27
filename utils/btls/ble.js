import BLEHandler from "./bleHandler"

/**
 * 蓝牙连接流程：
 * 1.先初始化蓝牙适配器
 * 2.搜寻附近的蓝牙外围设备
 * 3.获取设备ID
 * 4.停止搜寻
 * 5.开始连接
 * 6.激活特征值
 */

class BLE extends BLEHandler {
    constructor(blename) {
        super(blename)
    }
    async init() {
        // 蓝牙适配器初始化
        await this.openAdapter()
        // 搜索蓝牙设备
        await this.startSearch()
        // 获取设备ID
        await this.onBluetoothFound()
        // 停止搜索设备
        await this.stopSearchBluetooth()
        // // 连接蓝牙
        await this.connectBlue();
        // // 获取特征值
        await this.getCharacteristics();
    }
    async send() { }
    async close() {
        await this.closeBLEConnection()

    }
}

export { BLE };
