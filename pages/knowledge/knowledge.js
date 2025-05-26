import api from '../../config/setting'

Page({
    data: {
        categories: [],
        selectedCategoryId: null,
        selectedArticles: [],
        showPasswordModal: false,
        inputPassword: '',
        pendingCategory: null,
        diaryPassword: 'iamxiaogang344' 
    },

    onLoad() {
        this.fetchCategoriesWithArticles();
        
    },

    fetchCategoriesWithArticles() {
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        wx.request({
            url: api.knowledge,
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

                    this.setData({
                        categories: data,
                        selectedCategoryId: data[0]?.id || null,
                        selectedArticles: data[0]?.articles || []
                    });
                    console.log(this.data.categories)
                }
            },
            complete: () => wx.hideLoading()
        });
    },

    onSidebarSelect(e) {
        const id = e.currentTarget.dataset.id;
        const selectedCategory = this.data.categories.find(cat => cat.id === id);
        
        if (selectedCategory.name === 'My diary') {
          // 弹出密码框
          this.setData({
            showPasswordModal: true,
            inputPassword: '',
            pendingCategory: selectedCategory
          });
        } else {
          // 直接切换分类
          this.setData({
            selectedCategoryId: id,
            selectedArticles: selectedCategory ? selectedCategory.articles : []
          });
        }
      },

    goToDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/detail/detail?id=${id}&&type=konwledge`
        });
    },
    onPasswordInput(e) {
        this.setData({
          inputPassword: e.detail.value
        });
      },
      
      onCancelPassword() {
        this.setData({
          showPasswordModal: false,
          inputPassword: '',
          pendingCategory: null
        });
      },
      
      onConfirmPassword() {
        const { inputPassword, diaryPassword, pendingCategory } = this.data;
        if (inputPassword === diaryPassword) {
          this.setData({
            showPasswordModal: false,
            inputPassword: '',
            selectedCategoryId: pendingCategory.id,
            selectedArticles: pendingCategory.articles,
            pendingCategory: null
          });
          wx.showToast({ title: '验证成功', icon: 'success' });
        } else {
          wx.showToast({ title: '密码错误', icon: 'none' });
        }
      }
      

});