const app = getApp();

Page({
    data: {
        bleStatus: "",
        respond: []
    },
    onShow() {
        this.setData({
            bleStatus: app.globalData.bleStatus
        })
        if (app.globalData.ble) {
            app.globalData.ble.listen("respond", res => {
                console.log('接收到数据')
                let temp = this.data.respond
                temp.push(this.ab2hex(res.value))
                this.setData({
                    respond: temp
                })
            })
        }

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
    },
    writedata() {
        wx.showLoading({
            title: "正在发送...",
        });
        setTimeout(() => {
            wx.hideLoading()
        }, 1000);

    },
    ab2hex(buffer) {
        let hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function (bit) {
                return ('00' + bit.toString(16)).slice(-2)
            }
        )
        return hexArr.join('');
    }
});