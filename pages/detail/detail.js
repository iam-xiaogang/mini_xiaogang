import api from '../../config/setting';
const utils = require('../../utils/utils')
const request = require('../../utils/request')


Page({
    data: {
        article: {},
        comments: [],
        commentContent: '',
        file_type:''
    },

    onLoad(options) {
        const id = options.id;
        this.setData({
            file_type:options.type
        })
        this.getArticleDetail(id);
        // this.getComments(id);
    },
    urltype(){
        const file_type = this.data.file_type
        let url = ''
        if(file_type=='document'){
            url = api.document
        }else{
            url = api.knowledge
        }
        
        return url
    },
    getArticleDetail(id) {
        let url = this.urltype()
        wx.showLoading({
          title: '加载中哦',
          mask:true
        })
        request({
            url: `${url}${id}`,
            method: 'GET'
          }).then(res => {
            if (res.statusCode >= 200 && res.statusCode < 300 ) {
                res.data.timestamp = utils.formatTimeAgo(res.data.timestamp)

                this.setData({
                    article: res.data
                });
                
            }
          })
          wx.hideLoading();
       
    },

    // getComments(articleId) {
    //     // let url = this.urltype()
    //     const url = this.data.file_type=='document'?api.comment:api.konw_comment
    //     const tryRequest = () => {
    //         wx.request({
    //             url: `${url}?article=${articleId}`,
    //             method: 'GET',
    //             header: {
    //                 'Authorization': `Bearer ${wx.getStorageSync('access_token')}`
                // },
                // success: (res) => {
                //     if (res.statusCode === 200) {
                      
                //         res.data.results.forEach(comment => {
                //             comment.user_avatar = `${api.root}/media/${comment.user_avatar}`
                //             comment.timestamp = utils.formatTimeAgo(comment.timestamp);
                //         });

                        
                //         this.setData({
                //             comments: res.data.results
                //         });
                //     } else if (res.statusCode === 401) {
                        
                //         utils.refreshToken().then(() => {
    //                         tryRequest(); 
                            
    //                     }).catch(err => {
    //                         return
                            
    //                     });
    //                 }
    //             },
    //             fail: () => {
    //                 wx.showToast({
    //                     title: '网络错误',
    //                     icon: 'none'
    //                 });
    //             }
    //         });
    //     };

    //     tryRequest();
    // },
    onCommentInput(e) {
        this.setData({
            commentContent: e.detail.value
        });
    },

    // submitComment() {
    //     const content = this.data.commentContent.trim();
    //     const articleId = this.data.article.id;
    //     let url = this.data.file_type=='document'?api.comment:api.konw_comment

    //     if (!content) {
    //         wx.showToast({
    //             title: '评论不能为空',
    //             icon: 'none'
    //         });
    //         return;
    //     }
    //     request({
    //         url: `${url}`,
    //         method: 'POST',
    //         header: {
    //             'Authorization': `Bearer ${wx.getStorageSync('access_token')}`,
    //             'Content-Type': 'application/json',

                
    //         },
    //         data: {
    //             article: articleId,
    //             content: content
    //         },
    //       }).then(res => {
              
    //         if (res.statusCode >= 200 && res.statusCode < 300) {
    //             wx.showToast({
    //                 title: '评论成功'
    //             });
    //             this.setData({
    //                 commentContent: ''
    //             });
    //             this.getComments(articleId); // 重新获取评论
    //         }
    //       })
    // }
});