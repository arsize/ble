export default function (err) {
    console.log("err", err)
    if (err && err.errCode) {

        switch (err.errCode) {
            case 10001:
                return err.errCode + "：当前蓝牙适配器不可用"
            default:
                return "蓝牙功能暂不支持"
        }
    } else {
        return "蓝牙功能暂不支持"
    }

}