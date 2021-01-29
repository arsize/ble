const app = getApp();
const emitter = app.globalData.emitter
Page({
    data: {
        bleStatus: "",
        respond: []
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
    watchBLE() {
        if (app.globalData.ble) {
            app.globalData.ble.listen("channel", res => {
                if (res.type == 'response') {
                    let temp = this.data.respond
                    temp.push(this.ab2hex(res.data.value))
                    this.setData({
                        respond: temp
                    })
                }

            })
        }
    }
});