const db = wx.cloud.database()
Page({

  //  页面的初始数据
  data: {
    groupListData:[]
  },

  //  点击跳转到分类图片详情
  goDetail(event){
    const groupId = event.currentTarget.dataset.item._id
    const seriesId = this.data.seriesId
    wx.navigateTo({
      url: '/pages/classifyDetail/classifyDetail?seriesId='+seriesId+'&groupId='+groupId
    })  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    const seriesId = option.seriesId
    this.setData({
      seriesId: option.seriesId
    })
    // 获取分组列表
    db.collection('group_collect').where({
      seriesId:seriesId 
    }).get()
    .then(res =>{
      this.setData({  //  请求成功
        groupListData: res.data,
      })
    })
    .catch(err => {  //请求失败
    })

    // 设置页面标题
    db.collection('series_collect').where({
      _id:seriesId
    }).get()
    .then(res =>{
      wx.setNavigationBarTitle({
        title: res.data[0].seriesName
      })
    })
    .catch(err => {  //请求失败
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
