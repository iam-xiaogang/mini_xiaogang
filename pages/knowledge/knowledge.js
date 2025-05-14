
import api from '../../config/setting'

Page({
    data: {
      categories: [], // 分类及文章数据
      activeNames: [] // 控制展开状态
    },
  
    onLoad() {
      this.fetchCategoriesWithArticles();
    },
  
    fetchCategoriesWithArticles() {
      wx.request({
        url: api.knowledge, // 后端接口地址
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
              
            const data = res.data.results.map(cat => ({
              ...cat,

              name: cat.name || '未命名分类',
              articles: cat.articles.map(article => ({
                ...article,
                author_name: article.author_name || '匿名'
              }))
            }));
            this.setData({ categories: data });
          }
        },
        fail: () => {
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      });
    },
  
    onChange(event) {
      this.setData({ activeNames: event.detail });
    },
  
    goToDetail(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}&&type=konwledge`
      });
    }
  });
  