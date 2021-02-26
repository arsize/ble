const app = getApp();
const emitter = app.globalData.emitter
Page({
    data: {
        bleStatus: "",
        respond: [],
        blueyes: false, //是否重发同步指令
        connectStatus: ''//蓝牙连接状态信息
    },
    onShow() {
        this.setData({
            bleStatus: app.globalData.bleStatus
        })
        this.watchBLE()
    },
    gotoblue() {
        wx.navigateTo({
            url: '/pages/blue/blue',
        });
    },
    closeblue() {
        wx.showLoading({
            title: "正在停止...",
        });
        app.globalData.ble.close()
        setTimeout(() => {
            wx.hideLoading()
        }, 1000);
        app.globalData.bleStatus = false
        this.setData({
            bleStatus: false,
            respond: []
        })

    },
    writedata() {
        wx.showLoading({
            title: "正在发送...",
        });
        setTimeout(() => {
            wx.hideLoading()
        }, 1000);
        app.globalData.ble.send([0x00], 0x01)
    },
    ab2hex(buffer) {
        let hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function (bit) {
                return ('00' + bit.toString(16)).slice(-2)
            }
        )
        return hexArr.join('');
    },
    // 下发蓝牙机柜同步指令
    sendBlueOrders() {
        return new Promise((resolve, reject) => {
            let flow = app.globalData.ble.send([0x00], 0x01)//发送数据
            if (flow) {
                resolve()
            } else {
                reject()
            }
        })
    },
    watchBLE() {
        let that = this
        if (app.globalData.ble) {
            app.globalData.ble.listen(res => {
                if (res.type == 'connect') {
                    if (res.data == "未打开适配器") {
                        wx.showModal({
                            title: "提示",
                            content: "没有打开蓝牙",
                            showCancel: false,
                            confirmText: "确定",
                        });
                    } else {
                        if (res.data == "蓝牙已连接") {
                            this.setData({
                                connectStatus: "正在同步机柜数据"
                            })
                            that.sendBlueOrders().then(blue => {
                                setTimeout(() => {
                                    if (!that.data.blueyes) {
                                        console.log("重发同步指令")
                                        that.sendBlueOrders().then(blue2 => {
                                            wx.redirectTo({
                                                url: '/pages/confirmRentMapBlue/confirmRentMapBlue',
                                            });
                                        })
                                    } else {
                                        wx.redirectTo({
                                            url: '/pages/confirmRentMapBlue/confirmRentMapBlue',
                                        });
                                    }
                                }, 1000);
                            })
                            return
                        } else {
                            this.setData({
                                connectStatus: res.data
                            })
                        }

                    }
                } else if (res.type == "response") {
                    console.log('收到设备消息响应：', res)
                    if (res.data && res.data[3] == 0x02) {
                        // 已同步机柜信息
                        this.setData({
                            blueyes: true
                        })

                    }
                }
            })
        }
    }
});