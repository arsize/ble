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
        this.serviceId = "6xxx";
    }
    async openAdapter() {
        let [err, res] = await t._openAdapter.call(this);
        if (err != null) {
            this.emitter.emit("channel", {
                type: "connect",
                data: "未打开适配器"
            })
            return;
        }
    }
    async startSearch() {
        let [err, res] = await t._startSearch.call(this);
        if (err != null) {
            return;
        }
        this.emitter.emit("channel", {
            type: "connect",
            data: "正在连接中"
        })

    }
    async onBluetoothFound() {
        let [err, res] = await t._onBluetoothFound.call(this);
        if (err != null) {
            this.emitter.emit("channel", {
                type: "connect",
                data: "未找到设备"
            })
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
        this.emitter.emit("channel", {
            type: "connect",
            data: "蓝牙已连接"
        })
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
   async sentOrder(mudata, cmd) {
        let data = t._sentOrder(mudata, cmd)
        let [err, res] = await t._writeBLECharacteristicValue.call(this, data)
        if (err != null) {
            return
        }
    }

    // 打开蓝牙适配器状态监听
    onBLEConnectionStateChange() {
        wx.onBLEConnectionStateChange(res => {
            // 该方法回调中可以用于处理连接意外断开等异常情况
            if (!res.connected) {
                this.emitter.emit("channel", {
                    type: "connect",
                    data: "蓝牙已断开"
                })
            }

        })
    }

    // 收到设备推送的notification
    onBLECharacteristicValueChange() {
        wx.onBLECharacteristicValueChange(res => {
            this.emitter.emit("channel", {
                type: "response",
                data: res
            })
        })
    }
}
export default BLEHandler