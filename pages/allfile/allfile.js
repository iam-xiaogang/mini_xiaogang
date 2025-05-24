// pages/allfile/allfile.js
const utils = require('../../utils/utils')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        resultList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
     const allfile = wx.getStorageSync('savedFiles')
     this.setData({
        resultList:allfile
     })
    },
    deleteFile(e) {
        const index = e.currentTarget.dataset.index;
        const newFileList = this.data.resultList.filter((_, i) => i !== index);
        this.setData({
            resultList: newFileList
        });
        wx.setStorageSync('savedFiles', newFileList)
      },
    openFile(e) {
        const filePath = e.currentTarget.dataset.path;
        const fileType = filePath.split('.').pop(); // 提取后缀名
        wx.openDocument({
            filePath: filePath,
            fileType: fileType,
            success: () => {
                utils.Toast('打开文档成功',1500,'none');
            },
            fail: (err) => {
                wx.showToast({
                    title: '打开失败',
                    icon: 'none'
                });
                utils.Toast('打开文档失败', 1500,'none');
            }
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})