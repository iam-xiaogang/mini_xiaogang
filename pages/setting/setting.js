const utils = require('../../utils/utils')

Page({
    goToAccount() {
        
            const userInfo = wx.getStorageSync('userInfo');
            const token = wx.getStorageSync('access_token')
            if (userInfo && token) {
                wx.navigateTo({
                    url: '/pages/userinfo/userinfo' // 替换成实际的页面路径
                });
            } else {
                wx.showToast({
                    title: '请先登录',
                    icon: 'none'
                });
    
            }
        
    },
    clearCache(){
        
        wx.setStorageSync('savedFiles', [])
        utils.Toast('清除结束',3000,'sucess')

    },
    goToPrivacy() {
      wx.navigateTo({
        url: '/pages/privacy/privacy'
      });
    },
  
    goToGeneral() {
      wx.navigateTo({
        url: '/pages/general/general'
      });
    },
  
    goToAbout() {
      wx.navigateTo({
        url: '/pages/about/about'
      });
    },
  
    logout() {
      wx.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success(res) {
          if (res.confirm) {
            // 清除用户登录信息并跳转到登录页
            wx.removeStorageSync('access_token')
            wx.removeStorageSync('refresh_token')
            wx.removeStorageSync('userInfo')
            wx.reLaunch({
              url: '/pages/phonelogin/phonelogin'
            });
          }
        }
      });
    }
  });
  