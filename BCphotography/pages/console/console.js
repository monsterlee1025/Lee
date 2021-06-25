const db = wx.cloud.database()
Page({
  data: {
    // 临时的新建数据
    seriesArr: "",
    groupArr: "",
    photographyArr: [],
    bannerArr: [],
    // flieList:[],

    // 默认索引值
    choseSeriesIndex: 0,
    seriesIndex: [0],
    groupIndex: [0],
    photoGroupIndex:[0],
    currentIndex: [0],

    tabMenuList:['系列', '分组','图片', '轮播图'],  // tab菜单
    // 列表数据
    seriesListData: [], //  系列
    groupListData: [],  //  分组
    photoGroupListData: [],  //  图片的分组
    photographyListData: [],  //  作品图
    bannerListData: [],  //  轮播图
  },

  // 获取系列列表
  getSeriesData:async function(seriesListData){
    const res = await db.collection('series_collect').get();  
      this.setData({
        seriesListData: res.data,
      })
  },
  // 获取分组列表
  getGroupData:async function(groupListData){
    const seriesId = this.data.seriesListData[this.data.choseSeriesIndex]
    const res = await db.collection('group_collect').where({
      seriesId:seriesId._id
    })
    .get()
    .then(res => { //请求成功
      this.setData({
        groupListData: res.data,
      })
    })
  },
  // 获取作品图列表
  getPhotographyData:function(photographyListData){
    const seriesId = this.data.seriesListData[this.data.seriesIndex]._id
    const groupId = this.data.photoGroupListData[this.data.photoGroupIndex]._id
    db.collection('photography_collect').where({
      seriesId:seriesId,
      groupId:groupId
    })
    .get()
    .then(res => { //请求成功
      this.setData({
        photographyListData: res.data,
      })
    })
    .catch(err => {  //请求失败
    })
  },
  // 获取轮播图列表
  getBannerData:function(bannerListData){
    db.collection('banner_collect').get()
    .then(res => { //请求成功
      this.setData({
        bannerListData: res.data,
      })
    })
    .catch(err => {  //请求失败
    })
  },

  // 系列管理---------------------------------
  // 删除系列
  del_series_data(e){
    let that = this
    const _id = e.currentTarget.dataset.id
    const fileId = e.currentTarget.dataset.fileId
    wx.showModal({
      title: '',
      content: '确定要删除吗？',
      success (res) {
        if (res.confirm) {  // 点击确定
          db.collection("series_collect")
          .doc(_id)
          .remove()
          .then(res=>{  //  删除成功
            wx.cloud.deleteFile({
              fileList: [fileId]
            })
            that.getSeriesData()
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 500,
              mask:true
            })
          })
          .catch(err=>{  //  删除失败
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 500,
              mask:true
            })
          })
        } else if (res.cancel) {  //  点击取消
        }
      }
    })
  },
  // 选择图片
  selecSeriesImg() {
    let that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      success: chooseResult => {
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: 'series_img/' + new Date().getTime() + '.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          success: res => {
            wx.cloud.getTempFileURL({
              fileList: [{
                fileID: res.fileID
              }]
            }).then(res => {
              that.setData({
                seriesArr: {
                  url: res.fileList[0].tempFileURL,
                  fileId: res.fileList[0].fileID
                }
              })
            }).catch(error => {})
          },
        })
      },
    })
  },
  // 写入系列名称
  setSeriesName(e) {
    this.setData({
      seriesTitle: e.detail.value
    })
  },
  // 存储系列数据
  saveSeries() {
    let that = this
    let item = {
      seriesName: this.data.seriesTitle,
      seriesImgSrc: this.data.seriesArr.url,
      fileId: this.data.seriesArr.fileId
    }
    if(!this.data.seriesTitle){
      wx.showToast({
        title: '请填写名称',
        icon: 'none',
        duration: 500,
        mask:true
      })
      return
    }
    /***
     *  请求保存云数据
     */
    wx.cloud.database().collection('series_collect').add({ //integral_orders 插入到这个集合中
      data: item,
      success: function(res) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 500,
          mask:true
        })
        that.setData({
          seriesArr:'',
          seriesTitle:''
        })
        that.getSeriesData()
      }
    })

  },

  // 分组管理---------------------------------
  // 删除分组
  del_group_data(e){
    let that = this
    const _id = e.currentTarget.dataset.id
    const fileId = e.currentTarget.dataset.fileId
    wx.showModal({
      title: '',
      content: '确定要删除吗？',
      success (res) {
        if (res.confirm) {  // 点击确定
          db.collection("group_collect")
          .doc(_id)
          .remove()
          .then(res=>{  //  删除成功
            wx.cloud.deleteFile({
              fileList: [fileId]
            })
            that.getGroupData()
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 500,
              mask:true
            })
          })
          .catch(err=>{  //  删除失败
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 500,
              mask:true
            })
          })
        } else if (res.cancel) {  //  点击取消
        }
      }
    })
  },
  // 选择图片
  selectGroupImg() {
    let that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      success: chooseResult => {
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: 'group_img/' + new Date().getTime() + '.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          success: res => {
            wx.cloud.getTempFileURL({
              fileList: [{
                fileID: res.fileID
              }]
            }).then(res => {
              that.setData({
                groupArr: {
                  url: res.fileList[0].tempFileURL,
                  fileId: res.fileList[0].fileID
                }
              })
            }).catch(error => {})
          },
        })
      },
    })
  },
  // 写入输入框字段
  setGroupName(e) {
    this.setData({
      groupName: e.detail.value
    })
  },
  // 存储分组数据
  saveGroup() {
    let that = this
    if(!this.data.groupName){
      wx.showToast({
        title: '请填写名称',
        icon: 'none',
        duration: 500,
        mask:true
      })
      return
    }
    const seriesId = this.data.seriesListData[this.data.choseSeriesIndex]._id
      let item = {
        seriesId,
        groupName: this.data.groupName,
        groupImgSrc: this.data.groupArr.url,
        fileId: this.data.groupArr.fileId
      }
      /***
       *  请求保存云数据
       */
      wx.cloud.database().collection('group_collect').add({ //integral_orders 插入到这个集合中
        data: item,
        success: function(res) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500,
            mask:true
          })
          that.setData({
            groupArr:'',
            groupName:''
          })
          that.getGroupData()
        }
      })
    },

  // 作品图片管理---------------------------------
  // 删除图片
  del_photography_data(e){
    let that = this
    const _id = e.currentTarget.dataset.id
    const fileId = e.currentTarget.dataset.fileId
    wx.showModal({
      title: '',
      content: '确定要删除吗？',
      success (res) {
        if (res.confirm) {  // 点击确定
          db.collection("photography_collect")
          .doc(_id)
          .remove()
          .then(res=>{  //  删除成功
            wx.cloud.deleteFile({
              fileList: [fileId]
            })
            that.getPhotographyData()
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 500,
              mask:true
            })
          })
          .catch(err=>{  //  删除失败
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 500,
              mask:true
            })
          })
        } else if (res.cancel) {  //  点击取消
        }
      }
    })
  },

  // 选择图片
  selectPhotographyImg() {
    let that = this;
    // 选择图片
    wx.chooseImage({
      success: chooseResult => {
        // 将图片上传至云存储空间
        for(let i = 0; i < chooseResult.tempFilePaths.length; i++){

          wx.cloud.uploadFile({
            // 指定上传到的云路径
            cloudPath: 'photography_img/' + new Date().getTime() + '.png',
            // 指定要上传的文件的小程序临时文件路径
            filePath: chooseResult.tempFilePaths[i],
            success: res => {
              wx.cloud.getTempFileURL({
                fileList: [{
                  fileID: res.fileID
                }]
              }).then(res => {
                that.setData({
                  photographyArr: this.data.photographyArr.concat({
                    url: res.fileList[0].tempFileURL,
                    fileId: res.fileList[0].fileID
                  })
                })
              }).catch(error => {})
            },
          })
      }
      },
    })
  },

  // 存储图片数据
  savePhotography() {
    let that = this
    const seriesId = this.data.seriesListData[this.data.seriesIndex]._id
    const groupId = this.data.photoGroupListData[this.data.photoGroupIndex]._id
    const photographyImgSrc = this.data.photographyArr
    for ( var i = 0; i < photographyImgSrc.length; i++) { 
      var item = {
        seriesId,
        groupId,
        photographyImgSrc: photographyImgSrc[i].url,
        fileId: photographyImgSrc[i].fileId
      }
      // 请求保存云数据
      wx.cloud.database().collection('photography_collect').add({ //integral_orders 插入到这个集合中
        data: item,
        success: function(res) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 500,
            mask:true
          })
          that.setData({
            photographyArr:[],
          })
          that.getPhotographyData()
        }
      })
    }
  },

  // 轮播图管理---------------------------------
  // 删除
  del_banner_data(e){
    let that = this
    const _id = e.currentTarget.dataset.id
    const fileId = e.currentTarget.dataset.fileId
    wx.showModal({
      title: '',
      content: '确定要删除吗？',
      success (res) {
        if (res.confirm) {  // 点击确定
          db.collection("banner_collect")
          .doc(_id)
          .remove()
          .then(res=>{  //  删除成功
            wx.cloud.deleteFile({
              fileList: [fileId]
            })
            that.getBannerData()
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 500,
              mask:true
            })
          })
          .catch(err=>{  //  删除失败
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 500,
              mask:true
            })
          })
        } else if (res.cancel) {  //  点击取消
        }
      }
    })
  },
  // 选择轮播图
  selectBannerImg: function() {
    let that = this;
    // 选择图片
    wx.chooseImage({
      count: 9,
      success: chooseResult => {
        for(let i = 0; i < chooseResult.tempFilePaths.length; i++){
          that.uploadImg(chooseResult.tempFilePaths[i])
        }
      },
    })
  },
  uploadImg: function(filePath){
    let that = this;
    // 将图片上传至云存储空间
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: 'banner_img/' + new Date().getTime() + '.png',
      // 指定要上传的文件的小程序临时文件路径
      filePath: filePath,
      success: res => {
        wx.cloud.getTempFileURL({
          fileList: [{
            fileID: res.fileID
          }]
        }).then(re => {
          that.setData({
            bannerArr: that.data.bannerArr.concat({
              url: re.fileList[0].tempFileURL,
              fileId: re.fileList[0].fileID
            })
          })
        }).catch(error => {})
      },
    })
  },

  // 存储标签
  setBannerIndex(e) {
    this.setData({
      bannerIndex: e.detail.value
    })
  },
  // 存储轮播图数据
  saveBannerImg() {
    let that = this
    const bannerSrc = this.data.bannerArr
    for ( var i = 0; i < bannerSrc.length; i++) { 
      var item = {
        bannerSrc: bannerSrc[i].url,
        fileId: bannerSrc[i].fileId
      }
      /***
       *  请求保存云数据
       */
      wx.cloud.database().collection('banner_collect').add({ //integral_orders 插入到这个集合中
        data: item,
        success: function(res) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 500,
            mask:true
          })
          that.setData({
            bannerArr:[],
          })
          that.getBannerData()
        }
      })
   }
  },

  // tab菜单点击事件------------------------------
  clickTabTitle(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      currentIndex: index,
    })
  },

// 选择事件-----------------------------------
  // 新建分组-选择所属系列
  bindPickerChange: function (e) {
    const seriesId = this.data.seriesListData[e.detail.value]._id
    this.setData({
      choseSeriesIndex: e.detail.value,
    })
    this.getGroupData()
  },

  // 上传作品图-选择所属系列
  changeSeries:async function (event) {
    const seriesId = this.data.seriesListData[event.detail.value]._id
    this.setData({
      seriesIndex: event.detail.value
    })
    await this.getGroupDataForPhoto()
    await this.getPhotographyData()
  },

  // 获取图片的分组列表
  getGroupDataForPhoto:async function(){
    const seriesId = this.data.seriesListData[this.data.seriesIndex]
    const res = await db.collection('group_collect').where({
      seriesId:seriesId._id
    })
    .get()
    .then(res => { //请求成功
      this.setData({
        photoGroupListData: res.data,
      })
    })
  },

  // 上传作品图-选择所属分组
  changeGroup: function (e) {
    // const seriesId = this.data.seriesListData[e.detail.value]._id
    const groupId = this.data.photoGroupListData[e.detail.value]._id
    this.setData({
      photoGroupIndex: e.detail.value
    })
    this.getPhotographyData()
  },

  onLoad:async function() {
      await this.getSeriesData(),  //  系列-调用获取列表数据方法
      await this.getGroupData(),  //  分组-调用获取分组数据方法
      await this.getGroupDataForPhoto(),  //  分组-调用获取分组数据方法
      this.getPhotographyData(),  //  图片-调用获取图片数据方法
      this.getBannerData()  //  轮播图-调用获取banner图数据方法

  },

    //下拉刷新
    onRefresh(){
      //在当前页面显示导航条加载动画
      wx.showNavigationBarLoading(); 
      //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
      wx.showLoading({
        title: '刷新中...',
      })
      this.getData();
    },
    //网络请求，获取数据
    getData(){
      wx.request({
            url: '',
            //网络请求执行完后将执行的动作
            complete(res){
                //隐藏loading 提示框
                wx.hideLoading();
                //隐藏导航条加载动画
                wx.hideNavigationBarLoading();
                //停止下拉刷新
                wx.stopPullDownRefresh();
            }
      })   
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        //调用刷新时将执行的方法
      this.onRefresh();
    }

})