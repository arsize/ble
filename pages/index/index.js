const app = getApp();
import { BLE } from "../../utils/btls/ble";

const ble = new BLE("Wondware000001")

Page({
    data: {
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
