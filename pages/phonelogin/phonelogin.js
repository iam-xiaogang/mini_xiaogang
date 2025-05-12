import api from '../../config/setting'
const request = require('../../utils/request')
Page({
    data: {
        phone: '',
        code: '',
        canSendCode: true,
        countdown: 60,
        intervalId: null,
        openid:'',
        tempcode:''
    },

    onPhoneInput(e) {
        this.setData({
            phone: e.detail
        });
    },

    onCodeInput(e) {
        this.setData({
            code: e.detail
        });
    },

    sendCode() {
        if (!this.data.canSendCode || !this.data.phone) {
            wx.showToast({
                title: '输入手机号',
                duration: 1500,
                icon: 'none'

            })
            return
        };

        // 调用后端验证码发送接口
        request({
            url: api.send_code,
            method: 'POST',
            data: {
                phone: this.data.phone.value
            },
        }).then(res => {
            if (res.statusCode >= 200 && res.statusCode <= 300) {
                if (res.data.code === 0) {
                    wx.showToast({
                        title: '验证码已发送'
                    });
                    this.startCountdown();
                } else {
                    wx.showToast({
                        title: res.data.msg || '发送失败',
                        icon: 'none'
                    });
                }
            }
        })
        //   wx.request({
        //     url: api.send_code,
        //     method: 'POST',
        //     data: { phone: this.data.phone.value },
        //     success: (res) => {
        //       if (res.data.code === 0) {
        //         wx.showToast({ title: '验证码已发送' });
        //         this.startCountdown();
        //       } else {
        //         wx.showToast({ title: res.data.msg || '发送失败', icon: 'none' });
        //       }
        //     }
        //   });
    },

    startCountdown() {
        this.setData({
            canSendCode: false,
            countdown: 60
        });

        const intervalId = setInterval(() => {
            const newCount = this.data.countdown - 1;
            this.setData({
                countdown: newCount
            });

            if (newCount <= 0) {
                clearInterval(intervalId);
                this.setData({
                    canSendCode: true,
                    countdown: 60
                });
            }
        }, 1000);

        this.setData({
            intervalId
        });
    },

    login() {
        const {
            phone,
            code
        } = this.data;

        if (!phone || !code) {
            wx.showToast({
                title: '请输入手机号和验证码',
                icon: 'none'
            });
            return;
        }
        wx.login({
          success: (res) => {
            if(res.code){
                this.setData({
                    tempcode:res.code
                })
                console.log('hello',this.data.tempcode)
            }
          
        request({
            url: api.login,
            method: 'POST',
            data: {
                phone: this.data.phone.value,
                code: this.data.code.value,
                tempcode:this.data.tempcode
            },
            header: {
                'Content-Type': 'application/json' // 必须！
            },
        }).then(res => {
            if (res.statusCode >= 200 && res.statusCode <= 300) {
                if (res.data.access_token) {
                    wx.setStorageSync('access_token', res.data.access_token);
                    wx.setStorageSync('refresh_token', res.data.refresh);
                    wx.setStorageSync('userInfo', res.data.userinfo)
                    wx.showToast({
                        title: '登录成功'
                    });
                    wx.reLaunch({
                        url: '/pages/index/index'
                    });
                } else {
                    wx.showToast({
                        title: res.data.msg || '登录失败',
                        icon: 'none'
                    });
                }
            }

        })
    },
})

    }
});