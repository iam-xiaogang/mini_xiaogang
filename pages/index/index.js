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
    // onLoad(options) {
    //     wx.request({
    //       url: api.login,
    //       method:"GET",
    //       success:(res)=>{
              
    //           this.setData({
    //             banner_list:res.data.banner,
    //             notice:res.data.notice.content
    //         }
                  
    //       )
              

    //       }
    //     })
       

    // },
    getinfo(){
       wx.navigateTo({
         url: '/pages/getinfo/getinfo',
       })
    },
    onHelp() {
        wx.showToast({ title: '点击了帮助', icon: 'none' })
      },
      onCart() {
        wx.showToast({ title: '点击了购物车', icon: 'none' })
      },
      onMenu() {
        wx.showToast({ title: '点击了菜单', icon: 'none' })
      },
      onMessage() {
        wx.showToast({ title: '点击了消息', icon: 'none' })
      }
})
