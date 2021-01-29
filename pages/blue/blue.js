const app = getApp();
import { BLE } from "../../utils/btls/ble";
const emitter = app.globalData.emitter

Page({
    data: {
        baseUrlImg: app.globalData.baseUrlImg,
        ble: '',
        connectStatus: ""
    },
    onShow() {

    },
    startconnect() {
        const ble = new BLE("Wondware000001", emitter)
        this.ble = ble
        app.globalData.ble = ble
        this.ble.listen("connetc_status", res => {
            if (res == 'no_adapter') {
                wx.showModal({
                    title: "提示",
                    content: "没有打开蓝牙",
                    showCancel: false,
                    confirmText: "确定",
                });

            } else {
                this.setData({
                    connectStatus: res
                })
                app.globalData.bleStatus = res
            }

        })
        this.ble.init()

    }
});
