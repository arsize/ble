import * as t from "./tools"

/**
 * 蓝牙工具类
 * 封装小程序蓝牙流程方法
 * 处理事件通信
 */
class BLEHandler {
    constructor(blename, emitter) {
        this.blename = blename
        this.emitter = emitter
        this.readCharacteristicId = "";
        this.writeCharacteristicId = "";
        this.notifyCharacteristicId = "";
        this.deviceId = "";
        this.serviceId = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
    }
    async openAdapter() {
        let [err, res] = await t._openAdapter.call(this);
        if (err != null) {

            return;
        }
        this.emitter.emit("index", "开启了适配器")
    }
    async startSearch() {
        let [err, res] = await t._startSearch.call(this);
        if (err != null) {
            return;
        }
        this.emitter.emit("index", "开始搜suo")
    }
    async onBluetoothFound() {
        let [err, res] = await t._onBluetoothFound.call(this);
        if (err != null) {
            return;
        }
    }
    async stopSearchBluetooth() {
        let [err, res] = await t._stopSearchBluetooth.call(this);
        if (err != null) {
            return;
        }
        this.emitter.emit("index", "正在停止搜索")
    }
    async connectBlue() {
        let [err, res] = await t._connectBlue.call(this);
        if (err != null) {
            return;
        }
    }
    async getBLEServices() {
        let [err, res] = await t._getBLEServices.call(this);
        if (err != null) {
            return;
        }
    }
    async getCharacteristics() {
        let [err, res] = await t._getCharacteristics.call(this);
        if (err != null) {
            return;
        }
    }
    async notifyBLECharacteristicValueChange() {
        let [err, res] = await t._notifyBLECharacteristicValueChange.call(this);
        if (err != null) {
            return;
        }
    }
    async closeBLEConnection() {
        let [err, res] = await t._closeBLEConnection.call(this);
        if (err != null) {
            return;
        }
    }
    async closeBLEAdapter() {
        let [err, res] = await t._closeBLEAdapter.call(this);
        if (err != null) {
            return;
        }
    }

    // 收到设备推送的notification
    onBLECharacteristicValueChange() {
        wx.onBLECharacteristicValueChange(res => {
            console.log('接受到数据', res)

        })
    }
}
export default BLEHandler