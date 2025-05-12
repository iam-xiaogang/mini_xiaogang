import api from '../../config/setting'
Page({
    data:{
        banner_list:[{img:'/static/images/banner/1.jpg'}],
        notice:'demo'

    },
    onShow() {
        let userinfo = wx.getStorageSync('userInfo');
        console.log(userinfo);
        if (userinfo) {
            this.setData({
                notice: userinfo.username
            });
        }
    },
    goToPage(e) {
        const type = e.currentTarget.dataset.type;
        console.log(e.currentTarget.dataset) 
        console.log(type) // 获取功能类型
        wx.navigateTo({
          url: `/pages/tools/tools?type=${type}`  // 跳转并传参
        });
      }
    
    
})
