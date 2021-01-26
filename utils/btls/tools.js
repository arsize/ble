import { globalData } from "../global";
import errToString from "./error";

function _openAdapter() {
    print(`准备初始化蓝牙适配器...`);
    return wx.openBluetoothAdapter().then(
        (res) => [null, res],
        (err) => [errToString(err), null]
    );
}

/**
 * @param {Array<string>} services
 */
function _startSearch() {
    print(`准备搜寻附近的蓝牙外围设备...`);
    return promisify(wx.startBluetoothDevicesDiscovery, {
        services: [],
    }).then(
        (res) => [null, res],
        (err) => [errToString(err), null]
    );
}

/**
 *
 */
function _onBluetoothFound() {
    print(`监听寻找到新设备的事件...`);
    return promisify_callback(wx.onBluetoothDeviceFound).then(
        (res) => [null, res],
        (err) => [errToString(err), null]
    );
}

function _stopSearchBluetooth() {
    print(`停止查找新设备...`);
    return wx.stopBluetoothDevicesDiscovery().then(
        (res) => [null, res],
        (err) => [errToString(err), null]
    );
}

/**
 *
 */
function _connectBlue() {
    print(`开始连接设备...`);
    return promisify(wx.createBLEConnection, {
        deviceId: this.deviceId,
    }).then(
        (res) => [null, res],
        (err) => [errToString(err), null]
    );
}

// 获取并打开蓝牙特征值
function _getCharacteristics() {
    print(`开始获取特征值...`);
    return promisify(wx.getBLEDeviceCharacteristics, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
    }).then(
        (res) => [null, res],
        (err) => [errToString(err), null]
    );
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
    globalData.PRINT_SHOW ? console.log(str) : null;
}

module.exports = {
    print,
    _getCharacteristics,
    _connectBlue,
    _stopSearchBluetooth,
    _onBluetoothFound,
    _startSearch,
    _openAdapter,
    promisify,
    promisify_callback,
};
