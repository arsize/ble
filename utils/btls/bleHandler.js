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
            this.emitter.emit("connetc_status", "no_adapter")
            return;
        }
    }
    async startSearch() {
        let [err, res] = await t._startSearch.call(this);
        if (err != null) {
            return;
        }
        this.emitter.emit("connetc_status", "connecting")

    }
    async onBluetoothFound() {
        let [err, res] = await t._onBluetoothFound.call(this);
        if (err != null) {
            this.emitter.emit("connetc_status", "isoff")
            return;
        }

    }
    async stopSearchBluetooth() {
        let [err, res] = await t._stopSearchBluetooth.call(this);
        if (err != null) {
            return;
        }
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
        this.emitter.emit("connetc_status", "connected")
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
    // 打开蓝牙适配器状态监听
    onBLEConnectionStateChange() {
        wx.onBLEConnectionStateChange(res => {
            // 该方法回调中可以用于处理连接意外断开等异常情况
            console.log('res', res)
            if (!res.connected) {
                this.emitter.emit("connetc_status", res.connected)

            }

        })
    }

    // 收到设备推送的notification
    onBLECharacteristicValueChange() {
        wx.onBLECharacteristicValueChange(res => {
            this.emitter.emit("respond", res)
        })
    }
}
export default BLEHandler