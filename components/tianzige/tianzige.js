// components/tianzige/tianzige.js

import api from '../../config/setting'
const request = require('../../utils/request')
Component({

    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        text: '',
        countchar:0,
        image: '',
        fontList:[],
        selectedFont: '楷体',  // 默认选中第一个字体
        selectedIndex: 0

    },

    /**
     * 组件的方法列表
     */
    lifetimes:{
        created(){
            this.getfontlist()
        },
    },
    methods: {
        onInput(e) {
            this.setData({
              text: e.detail.value
            });
          },
        onFontChange(e) {
            const index = e.detail.value
            this.setData({
              selectedIndex: index,
              selectedFont: this.data.fontList[index]
            })
          },
        getfontlist(){
          this.setData({
              fontList:['楷体']
          })
        },
        generateRandomText(){
             request({
                 url:api.getrandomtext
             }).then(res=>{
                 console.log(res.data.data)
                 const data = res.data.data
                 this.setData({
                     text:data
                 })
             })
        },
        generateImage() {
            const that = this;
            if (!this.data.text.trim()) {
              wx.showToast({
                title: '请输入文字',
                icon: 'none'
              });
              return;
            }
        
            wx.request({
              url: api.tianzige, // ⚠️ 替换成你的 Django 接口地址
              method: 'POST',
              header: {
                'Content-Type': 'application/json'
              },
              data: {
                text: this.data.text
              },
              success(res) {
                if (res.data.image) {
                  that.setData({
                    image: res.data.image
                  });
                } else {
                  wx.showToast({
                    title: '生成失败',
                    icon: 'none'
                  });
                }
              },
              fail(err) {
                wx.showToast({
                  title: '请求失败',
                  icon: 'none'
                });
                console.error(err);
              }
            });
          }
    }
})