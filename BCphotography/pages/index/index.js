const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    bannerListData:[ ],
    seriesListData:[ ],
  },

  // 微信授权 --------------------------------
  getUserInfo(){
    let userInfo = wx.getStorageSync('userInfo') 
    if(!userInfo){
      wx.getUserProfile({
        desc: '授权个人信息',
        success: res =>{
          let user = res.userInfo
          wx.setStorageSync('userInfo', user)  //将用户信息缓存到本地
          this.getOpenId()    //  获取用户openid事件

          wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 500,
            mask:true
          })
        }
      })
    }
    return
  },

  // 获取从云函数获取openid---------------------------
  getOpenId(){
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
       wx.setStorageSync('openid', res.result.openid)  //将openid缓存到本地
      },
      fail: err => {
      }
    })
  },

  // 生命周期函数--监听页面加载  
  onLoad: function() {

    //请求轮播图数据
    wx.cloud.database().collection('banner_collect').get()
      .then(res => { //请求成
        this.setData({
          bannerListData: res.data,
        })
      })
      .catch(err => {  //请求失败
      }),

      //请求系列数据
      wx.cloud.database().collection('series_collect').get()
      .then(res => { //请求成功
        this.setData({
          seriesListData: res.data,
        })
      })
      .catch(err => {  //请求失败
      })
   
  },
  
  //跳转到分组列表页
  goClassifyList(event){
    const seriesId = event.currentTarget.dataset.item._id
    wx.navigateTo({
      url: '/pages/classifyList/classifyList?seriesId='+ seriesId
    })
  },

  // 进入工作台
  goConsole:async function() {
    let userOpenid = wx.getStorageSync('openid')    // 获取用户缓存中的openid
    db.collection('set_info_collect').where({      // 获取数据库的openid
      _id:"b00064a760ce2df92149fee243759ee0"
    })
    .get()
    .then(res =>{
      res.data[0].openid.forEach((val) => {     // 判断用户缓存中的openid是否在指定数据库中
        if(userOpenid ==val){
          wx.navigateTo({
            url: '/pages/console/console',
          })
          return
        }
      })
    })
  },

   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  // 页面转发
  onShareAppMessage: function () {

    wx.showShareMenu({      // 页面被用户分享时执行
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
    return {
      title: '半厨摄影工作室',
      path: '/pages/index/index',
      imageUrl: 'https://7068-photography-6gax5e10321218b2-1306289423.tcb.qcloud.la/icon/IMG_3284.JPG?sign=98aff699b4619d75d5ed87551ef9f2a3&t=1624090663'
    }
  },
})