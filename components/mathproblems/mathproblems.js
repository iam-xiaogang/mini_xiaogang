import api from '../../config/setting'
const request = require('../../utils/request')

Component({
    data: {
      problems: [],
      showAnswer: false
    },
  
    methods: {
        randnumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          },
      toggleAnswer() {
        this.setData({
          showAnswer: !this.data.showAnswer
        });
      },
  
      generateProblems() {
          wx.showLoading({
            title: '生成中',
            mask:true,
          })
          request({
              url:api.getwordproblems
          }).then(res=>{
              console.log(res.data)
              wx.hideLoading()
              this.setData({
                  problems:res.data.data
              })

          }).catch(err=>
            {
                console.log(err)
            })
        
  
        // this.setData({ problems });
      },
  
      generatePurchase() {
        const price = this.randnumber(1, 20);
        const count = this.randnumber(2, 10);
        return {
          question: `每本书${price}元，小明买了${count}本书，一共多少钱？`,
          answer: `${price * count}元`
        };
      },
  
      generateComparison() {
        const a = this.randnumber(10, 50);
        const b = this.randnumber(10, 50);
        const diff = Math.abs(a - b);
        return {
          question: `小红有${a}支铅笔，小明有${b}支铅笔，两人相差多少支？`,
          answer: `${diff}支`
        };
      },
  
      generateRemaining() {
        const total = this.randnumber(20, 50);
        const used = this.randnumber(1, total - 1);
        return {
          question: `一盒饼干有${total}块，吃了${used}块，还剩下多少块？`,
          answer: `${total - used}块`
        };
      },
  
      generateTime() {
        const hour = this.randnumber(1, 12);
        const minute = this.randnumber(10, 59);
        const total = hour * 60 + minute;
        return {
          question: `从家到学校花了${hour}小时${minute}分钟，一共花了多少分钟？`,
          answer: `${total}分钟`
        };
      },
  
      generateVolume() {
        const bottle = this.randnumber(100, 500);
        const count = this.randnumber(2, 10);
        return {
          question: `每瓶水${bottle}毫升，${count}瓶水一共有多少毫升？`,
          answer: `${bottle * count}毫升`
        };
      },
  
      
    }
  });
  