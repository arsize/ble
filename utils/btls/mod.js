import {
    print,
    _openAdapter,
    _startSearch,
    _onBluetoothFound,
    _stopSearchBluetooth,
    _connectBlue,
    _getCharacteristics,
} from "./tools";

async function openAdapter() {
    let [adapter_err, adapter_res] = await _openAdapter.call(this);
    if (adapter_err != null) {
        print(`初始化失败！${adapter_err}`);
        return;
    }
    print(`初始化成功！`);
}

async function startSearch() {
    let [search_err, search_res] = await _startSearch.call(this);
    if (search_err != null) {
        print(`搜索蓝牙设备失败`);
        return;
    }
    print(`搜索成功!`);
}

async function onBluetoothFound() {
    let [found_err, found_res] = await _onBluetoothFound.call(this);
    if (found_err != null) {
        print(`获取deviceid失败`);
        return;
    }
    this.deviceId = found_res.devices[0].deviceId;
    print(`获取deviceid成功:${this.deviceId}`);
}

async function stopSearchBluetooth() {
    let [stop_err, stop_res] = await _stopSearchBluetooth.call(this);
    if (stop_err != null) {
        print(`停止查询设备失败`);
        return;
    }
    print(`成功停止查找设备`);
}

async function connectBlue() {
    let [connect_err, connect_res] = await _connectBlue.call(this);
    if (connect_err != null) {
        print(`连接蓝牙失败！`);
        return;
    }
    print(`连接蓝牙成功！`);
}

async function getCharacteristics() {
    let [charact_err, charact_res] = await _getCharacteristics.call(this);
    if (charact_err != null) {
        print(`获取特征值失败！`);
        return;
    }
    _handleCharacteristics.call(this, charact_res);
    print(`获取特征值成功！`);
}

function _handleCharacteristics(res) {
    for (let i = 0; i < res.characteristics.length; i++) {
        let item = res.characteristics[i];
        if (item.properties.read) {
            this.readCharacteristicId = item.uuid;
        }
        if (item.properties.write && !item.properties.read) {
            this.writeCharacteristicId = item.uuid;
        }
        if (item.properties.notify || item.properties.indicate) {
            this.notifyCharacteristicId = item.uuid;
        }
    }
}

export {
    getCharacteristics,
    connectBlue,
    stopSearchBluetooth,
    onBluetoothFound,
    startSearch,
    openAdapter,
};
