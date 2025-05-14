import api from '../../config/setting'
const request = require('../../utils/request')

Page({
    data: {
      userInfo: {
        id: 0,
        username: '',
        email: '',
        phone: '',
        address: '',
        avatar_url: ''
      }
    },
  
    onInput(e) {
      const field = e.currentTarget.dataset.field
      this.setData({
        [`userInfo.${field}`]: e.detail
      })
    },
    onLoad(){
        const userinfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo:userinfo
        })
        
    
    },
    onChooseAvatar(e) {
      const avatarUrl = e.detail.avatarUrl
      
      this.setData({
        'userInfo.avatar_url': avatarUrl
      })
    },
    beforesubmint() {
        const imagePath = this.data.userInfo.avatar_url;
        const token = wx.getStorageSync('access_token');
      
        // 判断是否是本地临时路径（不是以 http 开头）
        if (imagePath && imagePath.startsWith('http://tmp')) {
          // 说明是用户刚刚选择的新头像，才上传
          wx.uploadFile({
            url: `${api.upload_image}?type=avatars`,
            filePath: imagePath,
            name: 'file',
            header: {
              'Authorization': `Bearer ${token}`
            },
            success: (res) => {
              const data = JSON.parse(res.data);
              this.data.userInfo.avatar_url = data.url;
              this.onSubmit(); // 上传成功后再提交更新
            },
            fail: (err) => {
              
              wx.showToast({
                title: '头像上传失败',
                icon: 'none'
              });
            }
          });
        } else {
          // 如果头像未更改，直接更新用户信息
          this.onSubmit();
        }
      },
      
       
    onSubmit() {
      const token = wx.getStorageSync('access_token') || ''
      delete this.data.userInfo.avatar
      
      request({
        url: api.update,
        method: 'post',
        header: {
            'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: this.data.userInfo,
      }).then(res=>{
          if(res.statusCode>=200 && res.statusCode <= 300){
            wx.setStorageSync('userInfo', res.data.user)
            wx.showToast({ title: '更新成功' })
          }
      }).catch(err=>{
        wx.showToast({ title: '更新失败', icon: 'error' })
      })
    }
  })
  