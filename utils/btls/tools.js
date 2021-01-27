import errToString from "./error";

let PRINT_SHOW = true //是否开启蓝牙调试

function _openAdapter() {
    print(`准备初始化蓝牙适配器...`);
    return wx.openBluetoothAdapter().then(
        (res) => {
            print(`✔ 适配器初始化成功！`);
            return [null, res]
        },
        (err) => {
            print(`x 初始化失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

/**
 * @param {Array<string>} services
 */
function _startSearch() {
    print(`准备搜寻附近的蓝牙外围设备...`);
    console.log('this.serviceId', this.serviceId)
    return promisify(wx.startBluetoothDevicesDiscovery, {
        interval: 1
    }).then(
        (res) => {
            print(`✔ 搜索成功!`);
            return [null, res]

        },
        (err) => {
            print(`x 搜索蓝牙设备失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

/**
 *
 */
function _onBluetoothFound() {
    print(`准备监听寻找到新设备的事件...`);
    return promisify_callback(wx.onBluetoothDeviceFound).then(
        (res) => {
            let device = res.devices[0];
            console.log('devices', res.devices)
            console.log(this.blename)
            console.log(device.name == this.blename)
            console.log(device.localName == this.blename)
            if ((device.name && device.name == this.blename) || (device.localName && device.localName == this.blename)) {
                this.deviceId = device.deviceId;
            }
            return [null, res]
        },
        (err) => {
            print(`x 获取deviceid失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

function _stopSearchBluetooth() {
    print(`停止查找新设备...`);
    return wx.stopBluetoothDevicesDiscovery().then(
        (res) => {
            print(`✔ 停止查找设备成功！`);
            return [null, res]
        },
        (err) => {
            print(`x 停止查询设备失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

/**
 *
 */
function _connectBlue() {
    print(`准备连接设备...`);
    return promisify(wx.createBLEConnection, {
        deviceId: this.deviceId,
    }).then(
        (res) => {
            print(`✔连接蓝牙成功！`);
            return [null, res]
        },
        (err) => {
            print(`x 连接蓝牙失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

function _closeBLEConnection() {
    print(`断开蓝牙连接...`)
    return promisify(wx.closeBLEConnection, {
        deviceId: this.deviceId,
    }).then(
        (res) => {
            print(`✔ 断开蓝牙连接成功！`);
            return [null, res]
        },
        (err) => {
            print(`x 断开蓝牙连接失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

// 获取蓝牙特征值
function _getCharacteristics() {
    print(`开始获取特征值...`);
    console.log("deviceid:", this.deviceId)
    console.log("serviceId:", this.serviceId)
    return promisify(wx.getBLEDeviceCharacteristics, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
    }).then(
        (res) => {
            print(`✔ 获取特征值成功！`);
            _handleCharacteristics.call(this, charact_res);
            return [null, res]
        },
        (err) => {
            print(`x 获取特征值失败！${errToString(err)}`);
            return [errToString(errToString(err)), null]
        }
    );
}

//获取芯片对应蓝牙特征值 
function _handleCharacteristics(res) {
    for (let i = 0; i < res.characteristics.length; i++) {
        let item = res.characteristics[i];
        if (item.properties.read) {
            this.readCharacteristicId = item.uuid;
            print(`readCharacteristicId:${item.uuid}`)
        }
        if (item.properties.write && !item.properties.read) {
            this.writeCharacteristicId = item.uuid;
            print(`writeCharacteristicId:${item.uuid}`)
        }
        if (item.properties.notify || item.properties.indicate) {
            this.notifyCharacteristicId = item.uuid;
            print(`notifyCharacteristicId:${item.uuid}`)
        }
    }
}


function promisify(fn, args) {
    return new Promise((resolve, reject) => {
        fn({
            ...(args || {}),
            success: (res) => resolve(res),
            fail: (err) => reject(err),
        });
    });
}
function promisify_callback(fn) {
    return new Promise((resolve, reject) => {
        fn(
            (res) => {
                resolve(res);
            },
            (rej) => {
                reject(rej);
            }
        );
    });
}

function print(str) {
    PRINT_SHOW ? console.log(str) : null;
}

export {
    print,
    _getCharacteristics,
    _connectBlue,
    _closeBLEConnection,
    _stopSearchBluetooth,
    _onBluetoothFound,
    _startSearch,
    _openAdapter,
    promisify,
    promisify_callback,
};
