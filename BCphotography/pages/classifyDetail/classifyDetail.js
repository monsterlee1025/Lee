// pages/classifyDetail/classifyDetail.js
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    photographyListData:[],
    photographyUrlList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    const seriesId = option.seriesId
    const groupId = option.groupId
    db.collection('photography_collect').where({
      seriesId:seriesId,
      groupId:groupId
    }).get()
    .then(res =>{
      let photographyUrlList = []
      res.data.forEach(re => {
        photographyUrlList.push(re.photographyImgSrc)
      });

      this.setData({  //  请求成功
        photographyListData: res.data,
        photographyUrlList: photographyUrlList
      })
    })
    .catch(err => {  //请求失败
    })
    // 设置页面标题
    db.collection('group_collect').where({
    _id:groupId
    }).get()
    .then(res =>{
      wx.setNavigationBarTitle({
        title: res.data[0].groupName
      })
    })
    .catch(err => {  //请求失败
    }) 
  },

  // 点击图片放大预览
  previewImg(e){
    const photographyUrlList = this.data.photographyUrlList

    wx.previewImage({
      current: photographyUrlList[e.currentTarget.dataset.index],
      urls: photographyUrlList
    })
  },

  // 分享
  onShareAppMessage: function () {
    // 页面被用户分享时执行
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
    return {
      title: '半厨摄影工作室',
      path: '/pages/index/index',
      imageUrl: 'https://7068-photography-6gax5e10321218b2-1306289423.tcb.qcloud.la/icon/IMG_3284.JPG?sign=98aff699b4619d75d5ed87551ef9f2a3&t=1624090663'
    }
  }

})