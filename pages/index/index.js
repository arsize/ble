const app = getApp()
import { BLE } from "../../utils/btls/ble";

Page({
  data: {
  },
  /**
   * 连接蓝牙
   */
  blueStart() {
    let ble = new BLE('001')
    ble.init().then(res=>{

    }).catch(err=>{
      console.log('err',err)
    })



  }
})
