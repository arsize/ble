const app = getApp();
import { BLE } from "../../utils/btls/ble";
const emitter = app.globalData.emitter

Page({
    data: {
        baseUrlImg: app.globalData.baseUrlImg,
        connectStatus: ""
    },
    onShow() {

    },
    startconnect() {
        const ble = new BLE("Wondware000001", emitter)
        app.globalData.ble = ble
        this.watchBLE()
        app.globalData.ble.init()
    },
    watchBLE() {
        if (app.globalData.ble) {
            app.globalData.ble.listen("channel", res => {
                if (res.type == 'connect') {
                    if (res.data == "未打开适配器") {
                        wx.showModal({
                            title: "提示",
                            content: "没有打开蓝牙",
                            showCancel: false,
                            confirmText: "确定",
                        });
                    } else {
                        this.setData({
                            connectStatus: res.data
                        })
                        app.globalData.bleStatus = res.data
                    }
                }
            })
        }
    }
});
