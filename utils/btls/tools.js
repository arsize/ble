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
            print(`✘ 初始化失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

/**
 * @param {Array<string>} services
 * @param { Int } interval
 */
function _startSearch() {
    print(`准备搜寻附近的蓝牙外围设备...`);
    return promisify(wx.startBluetoothDevicesDiscovery, {
        interval: 1000
    }).then(
        (res) => {
            print(`✔ 搜索成功!`);
            return [null, res]

        },
        (err) => {
            print(`✘ 搜索蓝牙设备失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

/**
 *@param {Array<string>} devices
 *@deviceId 设备ID
 */
function _onBluetoothFound() {
    print(`准备监听寻找到新设备的事件...`);
    return promisify_callback(wx.onBluetoothDeviceFound).then(
        (res) => {
            let devices = res.devices
            devices.forEach(element => {
                if ((element.name && element.name == this.blename) || (element.localName && element.localName == this.blename)) {
                    this.deviceId = element.deviceId
                    console.log('this.deviceId', this.deviceId)
                    return [null, res]
                }
            });
            return ['找不到设备', null]

        },
        (err) => {
            print(`✘ 获取deviceid失败！${errToString(err)}`);
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
            print(`✘ 停止查询设备失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

function _connectBlue() {
    print(`准备连接设备...`);
    return promisify(wx.createBLEConnection, {
        deviceId: this.deviceId,
    }).then(
        (res) => {
            print(`✔ 连接蓝牙成功！`);
            return [null, res]
        },
        (err) => {
            print(`✘ 连接蓝牙失败！${errToString(err)}`);
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
            print(`✔ 断开蓝牙成功！`);
            return [null, res]
        },
        (err) => {
            print(`✘ 断开蓝牙连接失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

function _closeBLEAdapter() {
    print(`释放蓝牙适配器...`)
    return wx.closeBluetoothAdapter().then(res => {
        print(`✔ 释放适配器成功！`)
        return [null, res]
    }, err => {
        print(`✘ 释放适配器失败！${errToString(err)}`)
        return [errToString(err), null]
    })
}

function _getBLEServices() {
    print(`获取蓝牙设备所有服务...`)
    return promisify(wx.getBLEDeviceServices, {
        deviceId: this.deviceId
    }).then(res => {
        print(`✔ 获取service成功！`)
        return [null, res]
    }, err => {
        print(`✘ 获取service失败！${errToString(err)}`)
        return [errToString(err), null]
    })
}

function _getCharacteristics() {
    print(`开始获取特征值...`);
    return promisify(wx.getBLEDeviceCharacteristics, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
    }).then(
        (res) => {
            print(`✔ 获取特征值成功！`);
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
            return [null, res]
        },
        (err) => {
            print(`✘ 获取特征值失败！${errToString(err)}`);
            return [errToString(errToString(err)), null]
        }
    );
}

/**
 * 对微信接口的promise封装
 * @param {function} fn 
 * @param {object} args 
 */
function promisify(fn, args) {
    return new Promise((resolve, reject) => {
        fn({
            ...(args || {}),
            success: (res) => resolve(res),
            fail: (err) => reject(err),
        });
    });
}

/**
 * 对微信接口回调函数的封装
 * @param {function} fn 
 */
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
    _getBLEServices,
    _closeBLEConnection,
    _closeBLEAdapter,
    _stopSearchBluetooth,
    _onBluetoothFound,
    _startSearch,
    _openAdapter,
    promisify,
    promisify_callback,
};
