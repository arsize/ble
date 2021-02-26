import BLEHandler from "./bleHandler"

class BLE extends BLEHandler {
    constructor(blename, emitter) {
        super(blename, emitter)
    }
    listen(callback) {
        // 蓝牙事件注册,打开channel
        this.emitter.removeAllListeners("channel")
        this.emitter.on("channel", callback)
    }
    removeListen() {
        // 移除所有蓝牙事件
        this.emitter.removeAllListeners("channel")
    }
    async init() {
        let flow = false
        // 打开蓝牙适配器状态监听
        this.onBLEConnectionStateChange()
        // 蓝牙适配器初始化
        await this.openAdapter()
        // 搜索蓝牙设备
        await this.startSearch()
        // 获取设备ID
        flow = await this.onBluetoothFound()
        // 停止搜索设备
        await this.stopSearchBluetooth()
        if (!flow) return
        // 连接蓝牙
        await this.connectBlue();
        // 获取serviceId
        await this.getBLEServices()
        // 设置特征值
        await this.getCharacteristics();
        // 订阅特征值
        await this.notifyBLECharacteristicValueChange()
        // 打开传输监听，等待设备反馈数据
        this.onBLECharacteristicValueChange()
    }
    // 发送指令
    async send(mudata, cmd) {
        let flow = await this.sentOrder(mudata, cmd)
        return flow
    }
    async close() {
        await this.closeBLEConnection()
        await this.closeBLEAdapter()
    }

}

export { BLE };
