import api from '../../config/setting'
const request = require('../../utils/request')
Page({
    data:{
        banner_list:[],
        notice:''

    },
    getnotice(){
        request({
            url:api.notices
        }).then(res=>{
          
            let data = res.data.results

            this.setData({
                notice:data[0].title
            })
        })
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
        this.getnotice()
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
        if(type=='maobizi' || type=='zitiebg'){
            wx.showToast({
              title: '开发中.....',
              icon:'none',
              duration:1500
                        })
                        return
        }
        wx.navigateTo({
          url: `/pages/tools/tools?type=${type}`  // 跳转并传参
        });
      }
    
    
})
