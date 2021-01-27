const app = getApp();
import { BLE } from "../../utils/btls/ble";

Page({
    data: {
        ble: ''
    },
    /**
     * 连接蓝牙
     */
    blueStart() {
        let ble = new BLE("Wondware000001");
        this.setData({
            ble: ble
        })
        this.data.ble.init()
            .then((res) => { })
            .catch((err) => {
                console.log("err", err);
            });
    },
    onHide() {
        this.data.ble.close().then(res=>{
            console.log('close success')
        })
    }
});
