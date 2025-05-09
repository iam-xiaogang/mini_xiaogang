
const request = require('../../utils/request')
Page({
    data: {
        avatar: '',
        avatar_url:'',
        userName: '',
        address: '',
        phone: '',
        isLoggedIn: false,
        
    
    avatarUrl: '',
    

    },
    getinfo(){
        wx.login({
          success: (res) => {
            console.log(res)
          },
        })
    },
    removeinfo(){
        wx.removeStorageSync('access_token');
        wx.removeStorageSync('refresh_token');
    },
    onQuickLogin() {
        wx.getUserProfile({
          desc: '用于完善用户资料',
          success: (res) => {
              console.log(res.userInfo)
            const { nickName, avatarUrl } = res.userInfo;
    
            this.setData({
              userName: nickName,
              avatarUrl: avatarUrl,
              isLoggedIn: true
            });
           console.log(this.data.userName,this.data.avatar)
            // 你可以选择这里直接请求后端绑定用户信息
            wx.request({
              url: 'https://your-api.example.com/update_userinfo', // 替换为你的后端地址
              method: 'POST',
              header: {
                'Authorization': `Bearer ${wx.getStorageSync('access_token')}`,
                'Content-Type': 'application/json'
              },
              data: {
                nickname: nickName,
                avatar: avatarUrl
              },
              success: (res) => {
                wx.showToast({ title: '登录成功' });
              },
              fail: () => {
                wx.showToast({ title: '登录失败', icon: 'none' });
              }
            });
          },
          fail: () => {
            wx.showToast({ title: '用户拒绝授权', icon: 'none' });
          }
        });
      },

    // 手机号登录按钮点击事件
    onPhoneLogin() {
        wx.navigateTo({
            url: '/pages/phonelogin/phonelogin' // 这里跳转到手机号登录页面，你可以自己实现手机号登录逻辑
        });
    },
    onSettingsClick() {
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo && userInfo.token) {
            wx.navigateTo({
                url: '/pages/setting/setting',
            })
        } else {
            wx.showToast({
                title: '请先登录',
                icon: 'none'
            });
        }

    },

    onShow() {

        const userInfo = wx.getStorageSync('userInfo');
        const token = wx.getStorageSync('access_token')
        if (userInfo && token) {
            this.setData({
                avatarUrl: userInfo.avatar_url,
                userName: userInfo.username,
                address: userInfo.address,
                phone: userInfo.phone,
                isLoggedIn: true
            });
        } else {
            this.setData({
                avatarUrl: '/static/images/avatar/1.jpg',
                userName: '请登录',
                address: '*******',
                phone: '**********',
                isLoggedIn: false

            });
        }
    },
    goLogin() {
        wx.navigateTo({
            url: '/pages/login/login'
        });
    },
    // 我的文章点击事件
    onArticleClick() {
        const userInfo = wx.getStorageSync('userInfo');
        const token = wx.getStorageSync('access_token')
        if (userInfo && token) {
            wx.navigateTo({
                url: '/pages/mydocument/mydocument' // 替换成实际的页面路径
            });
        } else {
            wx.showToast({
                title: '请先登录',
                icon: 'none'
            });

        }
    },

    // 我的信息点击事件
    onInfoClick() {
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

    // 联系客服点击事件
    onContactClick() {
        const userInfo = wx.getStorageSync('userInfo');
        const token = wx.getStorageSync('access_token')
        if (userInfo && token) {
            wx.makePhoneCall({
                phoneNumber: '13800000000' // 替换成实际的客服号码
            });
        } else {
            wx.showToast({
                title: '请先登录',
                icon: 'none'
            });
        }
    }
});