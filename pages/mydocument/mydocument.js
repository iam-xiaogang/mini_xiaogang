import api from '../../config/setting'
const utils = require('../../utils/utils')
const reqeust = require('../../utils/request')

Page({
    data: {
        articles: [],
        page: 1,
        pageSize: 5,
        hasMore: true,
    },

    goToDetail(e) {
        const articleId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/detail/detail?id=${articleId}`
        });
    },

    onLoad() {
        const userinfo = wx.getStorageSync('userInfo');
        this.setData({
            author: userinfo.username
        });
        this.loadArticles(); // 初次加载
    },

    loadArticles() {
        const {
            page,
            pageSize,
            author,
            articles
        } = this.data;

        if (!this.data.hasMore) return;
        reqeust({
            url: `${api.document}?page=${page}&page_size=${pageSize}`,
            method: 'GET',
        }).then(res => {
            if (res.statusCode >= 200 && res.statusCode <= 300) {
                const fetched = res.data.results || [];

                // 格式化时间
                fetched.forEach(item => item.timestamp = utils.formatTimeAgo(item.timestamp));

                // 筛选属于作者的
                const filtered = fetched.filter(item => item.author.name === author);

                // 判断是否还有更多数据
                const hasMore = fetched.length === pageSize;

                this.setData({
                    articles: articles.concat(filtered),
                    page: page + 1,
                    hasMore
                });
            }
        }).catch(err => {
            wx.showToast({
                title: '加载失败',
                icon: 'none',
                duration: 1500
            });
        })
    },


    onReachBottom() {
        this.loadArticles();
    }
});