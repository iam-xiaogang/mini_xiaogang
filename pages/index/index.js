import api from '../../config/setting'
const request = require('../../utils/request')
Page({
    data:{
        banner_list:[],
        notice:'demo'

    },
    getbanner(){
        request({
            url:api.banners,
        }).then(res=>{
            
            this.setData({
                banner_list:res.data.results
            })
        })
    },
    onLoad(){
        this.getbanner()
    },
    onShow() {
        let userinfo = wx.getStorageSync('userInfo');
       
        if (userinfo) {
            this.setData({
                notice: userinfo.username
            });
        }
    },
    goToPage(e) {
        const type = e.currentTarget.dataset.type;
        console.log(type)
        wx.navigateTo({
          url: `/pages/tools/tools?type=${type}`  // 跳转并传参
        });
      }
    
    
})
