import * as t from "./tools"

class BLEHandler {
    constructor(blename) {
        this.blename = blename
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
    }
    async startSearch() {
        let [err, res] = await t._startSearch.call(this);
        if (err != null) {
            return;
        }
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
}
export default BLEHandler