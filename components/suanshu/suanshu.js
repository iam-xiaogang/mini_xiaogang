Component({
    data: {
      questions: [],
      canvasHeight: 400,
      columns: 2,
      digitCount: 2,
      questionCount: 20,
      termCount: 2,
      showAnswer: false, 
    },
  
    methods: {
      // 调节项数
      onActionSheet() {
        wx.showActionSheet({
            itemList: ['保存图片', '预览图片以便分享'],
            success: (res) => {
              if (res.tapIndex === 0) {
                this.saveImage();
              } else if (res.tapIndex === 1) {
                this.shareImage(); // 实际为预览图片
              }
            }
          });
      },
      
      shareImage() {
        wx.canvasToTempFilePath({
          canvasId: 'mathCanvas',
          success: (res) => {
            wx.previewImage({
              urls: [res.tempFilePath],
              current: res.tempFilePath,
              success() {
                wx.showToast({
                  title: '长按图片可分享',
                  icon: 'none'
                });
              }
            });
          },
          fail(err) {
            wx.showToast({
              title: '生成图片失败',
              icon: 'error'
            });
            console.error(err);
          }
        }, this);
      },
             
      
      onTermCountChange(e) {
        this.setData({
          termCount: parseInt(e.detail)
        });
      },
      onShowAnswerChange(e) {
        this.setData({
          showAnswer: e.detail
        });
        if (this.data.questions.length > 0) {
            this.drawQuestions(this.data.questions);
          }
      },
      
  
      generateQuestions(count, digitCount, termCount) {
        const questions = [];
      
        for (let i = 0; i < count; i++) {
          const terms = [];
          const operators = [];
      
          for (let j = 0; j < termCount; j++) {
            const num = this.randomNumber(digitCount);
            terms.push(num);
            if (j < termCount - 1) {
              const op = Math.random() > 0.5 ? '+' : '-';
              operators.push(op);
            }
          }
      
          // 计算表达式结果，保证非负数
          let result = terms[0];
          for (let k = 0; k < operators.length; k++) {
            if (operators[k] === '+') result += terms[k + 1];
            else result -= terms[k + 1];
          }
      
          // 如果结果小于0，跳过该题（重新生成）
          if (result < 0) {
            i--;
            continue;
          }
      
          let expression = `${terms[0]}`;
          for (let k = 0; k < operators.length; k++) {
            expression += ` ${operators[k]} ${terms[k + 1]}`;
          }
      
          questions.push({
            expr: expression,
            result: result
          });
        }
      
        return questions;
      },
      
  
      // 随机整数
      randomNumber(digitCount) {
        const min = digitCount === 1 ? 0 : Math.pow(10, digitCount - 1);
        const max = Math.pow(10, digitCount) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
  
      // 绘制表达式
      drawQuestions(questions) {
        const ctx = wx.createCanvasContext('mathCanvas', this);
        const columns = this.data.columns;
        const showAnswer = this.data.showAnswer;
      
        let fontSize = 40;
        if (columns === 1) fontSize = 25;
        else if (columns === 2) fontSize = 20;
        else if (columns === 3) fontSize = 15;
        else if (columns === 4) fontSize = 10;
        else fontSize = 5;
      
        const lineHeight = fontSize + 20;
        const canvasWidth = wx.getSystemInfoSync().windowWidth;
        const rows = Math.ceil(questions.length / columns);
        const canvasHeight = rows * lineHeight + 20;
      
        this.setData({
          canvasHeight
        });
      
        setTimeout(() => {
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.setFillStyle('#000');
          ctx.setFontSize(fontSize);
          ctx.setTextBaseline('top');
      
          const paddingLeft = 20;
          const colWidth = canvasWidth / columns;
      
          questions.forEach((q, idx) => {
            const col = idx % columns;
            const row = Math.floor(idx / columns);
            const x = paddingLeft + col * colWidth;
            const y = 10 + row * lineHeight;
            const text = `${q.expr} = ${showAnswer ? q.result : ''}`;
            ctx.fillText(text, x, y);
          });
      
          ctx.draw();
        }, 50);
      },
      
      
        
  
  
      // 生成并绘制
      generateAndDraw() {
        const { questionCount, digitCount, termCount } = this.data;
        const questions = this.generateQuestions(questionCount, digitCount, termCount);
        this.setData({ questions });
        this.drawQuestions(questions);
      },
  
      // 保存图片
      saveImage() {
        wx.canvasToTempFilePath({
          canvasId: 'mathCanvas',
          success: (res) => {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success() {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success'
                });
              },
              fail(err) {
                wx.showToast({
                  title: '保存失败',
                  icon: 'error'
                });
                console.error(err);
              }
            });
          },
          fail(err) {
            wx.showToast({
              title: '导出失败',
              icon: 'error'
            });
            console.error(err);
          }
        }, this);
      },
  
      // 改变列数
      onColumnsChange(e) {
        this.setData({ columns: e.detail });
        if (this.data.questions.length > 0) {
          this.drawQuestions(this.data.questions);
        }
      },
  
      // 改变位数
      onDigitCountChange(e) {
        this.setData({ digitCount: e.detail });
      },
  
      // 改变题目数量
      onQuestionCountChange(e) {
        this.setData({ questionCount: e.detail });
      }
    }
  });
  