import * as t from "./tools"
import { HTTP } from "../server";

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
        this.serviceId = "6xx";
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
        return true
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
        return true
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
            this.emitter.emit("channel", {
                type: "connect",
                data: "无法订阅特征值"
            })
            // 取消连接
            this.closeBLEConnection()
            this.closeBLEAdapter()
            wx.setStorageSync("bluestatus", "");
            return;
        }
        this.emitter.emit("channel", {
            type: "connect",
            data: "蓝牙已连接"
        })
        wx.setStorageSync("bluestatus", "on");
        return true
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
        console.log("-- 发送数据:", data)
        let arrayBuffer = new Uint8Array(data).buffer;
        let [err, res] = await t._writeBLECharacteristicValue.call(this, arrayBuffer)
        if (err != null) {
            return
        }
        console.log("数据发送成功！")
        return true

    }

    // 打开蓝牙适配器状态监听
    onBLEConnectionStateChange() {
        wx.onBLEConnectionStateChange(res => {
            // 该方法回调中可以用于处理连接意外断开等异常情况
            if (!res.connected) {
                this.closeBLEAdapter()
                wx.setStorageSync("bluestatus", "");
                this.emitter.emit("channel", {
                    type: "connect",
                    data: "蓝牙已断开"
                })
            }
        }, err => {
            console.log('err', err)
        })
    }

    // 收到设备推送的notification
    onBLECharacteristicValueChange() {
        let lastDate = new Date().getTime()
        wx.onBLECharacteristicValueChange(res => {
            let arrbf = new Uint8Array(res.value)
            let nowDate = new Date().getTime()
            console.log(`收到硬件数据反馈！命令码为：${arrbf[3]}`)
            if (this._checkData(arrbf)) {
                if ((nowDate - lastDate) > 800) {
                    console.log('-- 节流800ms,Lock!')
                    lastDate = nowDate
                    this._uploadInfo(arrbf)
                    this.emitter.emit("channel", {
                        type: "response",
                        data: arrbf
                    })
                }
            }
        })
    }
    _uploadInfo(message) {
        console.log("-- 准备数据同步！", this._mapToArray(message))
        let bleorder = wx.getStorageSync("bleorder");
        let blecabinet = wx.getStorageSync("blecabinet")
        HTTP({
            url: "cabinet/uploadBlueData",
            methods: "post",
            data: {
                cabinetQrCode: blecabinet,
                order: bleorder,
                message: this._mapToArray(message)
            }
        }).then(res => {
            console.log("✔ 数据同步成功！")

        }, err => {
            console.log('✘ 数据同步失败', err)
        })
    }
    _mapToArray(arrbf) {
        let arr = []
        arrbf.map(item => {
            arr.push(item)
        })
        return arr
    }
    // 校验数据正确性
    _checkData(arrbf) {
        // 校验帧头帧尾
        if (arrbf[0] != 0xEE || arrbf[1] != 0xFA || arrbf[arrbf.length - 1] != 0xFF || arrbf[arrbf.length - 2] != 0xFC) {
            console.log('✘ 帧头帧尾不匹配，请重发')
            console.log('帧头:', arrbf[0])
            console.log('帧头:', arrbf[1])
            console.log('帧尾:', arrbf[arrbf.length - 1])
            console.log('帧尾:', arrbf[arrbf.length - 2])
            return false
        }
        // 校验CRC
        let crc = _modBusCRC16(arrbf, 2, arrbf.length - 5)
        if (arrbf[arrbf.length - 3] != crc & 0xff && arrbf[arrbf.length - 4] != (crc >> 8) & 0xff) {
            console.log('✘ crc校验错误，请重发')
            return false
        }
        console.log('✔ 数据校验成功，接受完整！')
        return true
    }

}
export default BLEHandler