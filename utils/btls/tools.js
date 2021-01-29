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
    print(`监听搜寻新设备事件...`);
    return _onBluetoothFound_promise.call(this).then(res => {
        print(`✔ 设备ID找到成功!`);
        return [null, res]
    }, err => {
        print(`✘ 设备ID找到失败!`);
        return [errToString(err), null]

    })
}

/**
 * @param {Array} devices 查找到设备数组
 * @param {int} count 计数器-嗅探2次
 */
function _onBluetoothFound_promise() {
    let devices = []
    let count = 0
    return new Promise((resolve, reject) => {
        wx.onBluetoothDeviceFound(res => {
            devices.push(...res.devices)
            count++
            if (count > 1) {
                devices.forEach(element => {
                    if ((element.name && element.name == this.blename) || (element.localName && element.localName == this.blename)) {
                        this.deviceId = element.deviceId
                        resolve(res)
                    }
                });
                reject('device not found')
            }
            print(`已嗅探蓝牙设备数：${devices.length}...`)
        }, err => {
            reject(err)
        })
    })
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

// 订阅特征值
function _notifyBLECharacteristicValueChange() {
    return promisify(wx.notifyBLECharacteristicValueChange, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        characteristicId: this.notifyCharacteristicId,
        state: true
    }).then(res => {
        print(`✔ 订阅notify成功！`)
        return [null, res]
    }, err => {
        print(`✘ 订阅notify失败！${errToString(err)}`)
        return [errToString(err), null]
    })
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
    _notifyBLECharacteristicValueChange,
    _onBluetoothFound,
    _startSearch,
    _openAdapter,
    promisify,
    promisify_callback,
};
