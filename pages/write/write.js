import api from '../../config/setting'
const request = require('../../utils/request')

Page({
    data: {
        title: '',
        // editor: '',
        content: '',
        summary: '',
        // thumbnail: '',
        // origin_author: '',
        // origin_url: '',
        h_role: 0,
        tempImagePath: '',
        roles: ['原创', '转载', '翻译'],
        art_img_url: ''
    },

    onInput(e) {
        const key = e.currentTarget.dataset.key;
        this.setData({
            [key]: e.detail.value
        });
    },

    onRoleChange(e) {
        this.setData({
            h_role: parseInt(e.detail.value)
        });
    },
    chooseImage() {
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            success: (res) => {
                const tempFilePath = res.tempFiles[0].tempFilePath;
                this.setData({
                    tempImagePath: tempFilePath
                });
            }
        });
    },
    uploadImageAndSubmit() {
        const requiredFieldsdict = {
            'title': '标题还没写呢',
            'content': '不说些什么？',
            'summary': '大概内容指的是什么？',
            'tempImagePath': '没有上传图片哦'
        }
        const requiredFields = ['title', 'summary', 'content', 'tempImagePath'];
        for (let field of requiredFields) {
            
            if (!this.data[field]) {
                wx.showToast({
                    title: requiredFieldsdict[field],
                    icon: 'none'
                });
                return;
            }
        }

        const token = wx.getStorageSync('access_token');
        const imagePath = this.data.tempImagePath;

        // 步骤一：上传图片
        wx.uploadFile({
            url: `${api.upload_image}?type=documents`,
            filePath: imagePath,
            name: 'file',
            header: {
                'Authorization': `Bearer ${token}`
            },
            success: (res) => {
                const data = JSON.parse(res.data);
                const art_img_url = data.url;

                // 步骤二：提交文章
                this.submitArticle(art_img_url);
            },
            fail: (err) => {
                
                wx.showToast({
                    title: '图片上传失败',
                    icon: 'none'
                });
            }
        });
    },

    submitArticle(art_img) {
        const payload = {
            title: this.data.title,
            //   editor: this.data.editor,
            content: this.data.content,
            summary: this.data.summary,
            //   thumbnail: this.data.thumbnail,
            //   origin_author: this.data.origin_author,
            //   origin_url: this.data.origin_url,
            h_role: this.data.h_role,
            art_img_url: art_img
        };
        wx.showLoading({
            title: '正在发布...',
            mask: true  // 可选：防止用户点击其他操作
        });
        request({
            url: api.create_article,
            method: 'POST',
            data: payload,
            header: {
                'Authorization': `Bearer ${wx.getStorageSync('access_token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res=>{
            wx.hideLoading();
            if(res.statusCode>=200 && res.statusCode<=300){
                wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 1500
                });

                setTimeout(() => {
                    const pages = getCurrentPages();
                    if (pages.length > 1) {
                        const prevPage = pages[pages.length - 2];
                        if (prevPage.loadArticles) {
                            prevPage.loadArticles(); // 触发上一页自定义的刷新函数
                        }
                    }
                    wx.navigateBack();
                }, 3000);
            }
        }).catch(err=>{
            
                wx.showToast({
                    title: '发布失败',
                    icon: 'none'
                });
        })
    }
});