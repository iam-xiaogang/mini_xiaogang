import api from '../../config/setting'
const request = require('../../utils/request')

Page({
  data: {
    items: [],
    loading: true,
    hasMore: true,
    page: 1,
    pageSize: 10, 
  },
  goToDetail: function (e) {
    const articleId = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: `/pages/detail/detail?id=${articleId}&&type=document`
    
    });
  },
//   onLoad() {
//     this.getMockData(this.data.page);
//   },
  onShow(){
    this.getMockData(this.data.page);
  },

  async loadData() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });

    try {
      const newItems = await this.getRemoteData(this.data.page, this.data.pageSize);
      const hasMore = newItems.length >= this.data.pageSize;

      this.setData({
        items: this.data.items.concat(newItems),
        loading: false,
        hasMore,
        page: this.data.page + 1
      });
    } catch (err) {
      
      this.setData({ loading: false });
    }
  },

  // 使用 Promise 封装 wx.request
  getMockData: function (page) {
    const pageSize = 10;
    request({
        url: `${api.document}?page=${page}&page_size=${pageSize}`,
      method: 'GET',
      }).then(res => {
        if (res.statusCode >= 200 && res.statusCode <= 300) {
            const newItems = res.data.results || res.data; // 若无分页器就直接用 res.data
            
        
          const allItems = this.data.items.concat(newItems);
    
          this.setData({
            items: allItems,
            loading: false,
            hasMore: newItems.length >= pageSize,
            page: page + 1
          });
          
        }
      }).catch(err=>{
        this.setData({ loading: false });
      })


  },
  
  goToWrite() {
      const token = wx.getStorageSync('access_token')
      
      if(!token){
          wx.showToast({
            title: '请先登录',
            duration:1500,
            icon:'none',
          })
          return
      }
    wx.navigateTo({
      url: '/pages/write/write'
    });
  },
  onPullDownRefresh() {
    this.setData({
      items: [],
      page: 1,
      hasMore: true,
      loading: true
    });
    this.getMockData(1);
    wx.stopPullDownRefresh(); 
  },
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ loading: true });
      this.getMockData(this.data.page);
    }
  }
});
