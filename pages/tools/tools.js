import api from '../../config/setting'
const utils = require('../../utils/utils')
Page({
    data: {
        functionType: '',
        filePath: '',
        downloadfilepath: '',
        fileList: [],
        wordUrl: '',
        showSuccessModal:false,
        fileName:''
    },
    onLoad(options) {

        const {
            type
        } = options; // 获取传递的功能类型参数
        this.setData({
            functionType: type // 根据参数设置当前功能类型
        });
        this.loadFileList()
    },

    loadFileList() {
        const files = wx.getStorageSync('savedFiles') || [];
        this.setData({
            fileList: files
        });
    },

    chooseFile() {
        const info = wx.getStorageSync('userInfo')
        if(!info.openid){
            utils.Toast('请先登录',1500,'none')
            return 
        }else if(!info.username){
            utils.Toast('请先完善个人信息,作为下载链接',1500,'none')
        }
        wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success: (res) => {
                const filePath = res.tempFiles[0].path;
                const fileName = res.tempFiles[0].name;

                this.uploadFile(filePath);
            },
            fail: (err) => {
                utils.Toast('请选择文件', 1500, 'none');

                console.error(err);
            }
        });
    },

    uploadFile(filePath) {
        wx.showLoading({
            title: '上传中',
            mask: true
        })

        wx.uploadFile({
            url: api.pdftoword, // 替换为实际后端接口
            filePath: filePath,
            name: 'file',
            header: {
                'Authorization': `Bearer ${wx.getStorageSync('access_token')}`,
                'Content-Type': 'multipart/form-data'
            },
            success: (uploadRes) => {
                const data = JSON.parse(uploadRes.data);
                if (data.word_url) {
                    console.log(data.word_url)

                    utils.Toast('转换成功', 1500, 'success')
                    this.setData({
                        wordUrl: data.word_url,
                        showSuccessModal: true
                    });

                    // 提供下载
                    console.log(this.data.wordUrl)
                    this.downloadFile(data.word_url);
                } else {
                    utils.Toast('上传失败', 1500, 'fail')
                }
            },
            fail: (err) => {
                utils.Toast('上传失败', 1500, 'fail')
                console.error(err);
            }
        });
    },
    copyLink() {
        wx.setClipboardData({
          data: this.data.wordUrl,
          success() {
            wx.showToast({ title: '链接已复制', icon: 'none' });
          }
        });
      },
      closeModal() {
        this.setData({ showSuccessModal: false });
      },
    downloadFile(url) {
        const info = wx.getStorageSync('userInfo')
        let name = info.username.replace(/[\p{P}\p{S}]/gu, "");
        
        let timestamp = utils.getFormattedTime()
        const fileName = `${name}_${timestamp}.docx`;
        this.setData({fileName:fileName})
        wx.downloadFile({
            url: url,
            success: (res) => {
                if (res.statusCode === 200) {
                    wx.showToast({
                        title: '下载成功',
                        icon: 'success',
                        duration: 1500
                    });

                    
                    const files = wx.getStorageSync('savedFiles') || [];
                    files.push({
                        name: fileName,
                        path: res.tempFilePath
                    });
                    wx.setStorageSync('savedFiles', files);
                    this.loadFileList();
                    ß
                } else {
                    utils.Toast('下载失败', 1500, 'fail')
                }
            },
            fail: (err) => {
                utils.Toast('下载失败', 1500, 'fail')
                console.error('下载失败', err);
            }
        });
    },
    openFile(e) {
        const filePath = e.currentTarget.dataset.path;
        console.log(filePath)
        const fileType = filePath.split('.').pop(); // 提取后缀名

        wx.openDocument({
            filePath: filePath,
            fileType: fileType,
            success: () => {
                console.log('打开文档成功');
            },
            fail: (err) => {
                wx.showToast({
                    title: '打开失败',
                    icon: 'none'
                });
                console.error('打开文档失败', err);
            }
        });
    }

});