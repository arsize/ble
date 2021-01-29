const app = getApp();
const emitter = app.globalData.emitter
import { BLE } from "../../utils/btls/ble";

const ble = new BLE("Wondware000001", emitter)

Page({
    data: {
    },
    onShow() {
        emitter.on("index", res => {
            console.log('首页接收到：',res)
        })
    },
    blueStart() {
        ble.init()
            .then((res) => { })
            .catch((err) => {
                console.log("err", err);
            });
    },
    onHide() {
        ble.close().then(res => {
            console.log('close success')
        })
    }
});
