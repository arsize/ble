import BLEHandler from "./bleHandler"

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
        // 连接蓝牙
        await this.connectBlue();
        // 获取serviceId
        await this.getBLEServices()
        // 获取特征值
        await this.getCharacteristics();
    }
    async send() { }
    async close() {
        await this.closeBLEConnection()
        await this.closeBLEAdapter()

    }
}

export { BLE };
