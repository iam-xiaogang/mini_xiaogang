// components/pdf_to_word/pdf_to_word.js
const utils = require('../../utils/utils')
import api from '../../config/setting';

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
        filePath: '',
        downloadfilepath: '',
        fileList: [],
        wordUrl: '',
        showSuccessModal:false,
        fileName:'',
        resultList:[]
    },

    /**
     * 组件的方法列表
     */
    lifetimes:{
        created(){
            this.loadFileList()
        },
    },
    methods: {
        
        loadFileList() {
            const files = wx.getStorageSync('savedFiles') || [];
            const filterfiles = files.filter(file => file.name.endsWith(".docx"));
            this.setData({
                resultList: filterfiles
            });
        },
        clearResultList(){
            const data = wx.getStorageSync('savedFiles')
           if(data.length == 0){
               utils.Toast('没有资料啦～',1500,"none")
           }
           const newfile = data.filter(item=>!item.path.endsWith('.docx'))
           wx.setStorageSync('savedFiles', newfile)
           this.setData({
               resultList:newfile
           })
        },
        chooseFiles() {
            const that = this;
            wx.showActionSheet({
              itemList: ['拍照', '从相册选择图片'],
              success(res) {
                switch (res.tapIndex) {
                  case 0:
                    // 拍照
                    wx.chooseImage({
                      count: 1,
                      sourceType: ['camera'],
                      success: imgRes => {
                          console.log(imgRes)
                          const file = imgRes.tempFilePaths.map(item=>({
                            path:item,
                            name: that.cutfilename(item.split('/').pop()),
                            type: 'image'
                          }))
                          that.setData({
                            fileList:that.data.fileList.concat(file)
                        })
                      }
                    });
                    break;
                  case 1:
                    // 相册
                    wx.chooseImage({
                      count: 9,
                      sourceType: ['album'],
                      success: imgRes => {
                        console.log(imgRes)
                        const file = imgRes.tempFilePaths.map(item=>({
                            path:item,
                            name: that.cutfilename(item.split('/').pop()),
                            type: 'image'
                          }))
                          that.setData({
                            fileList:that.data.fileList.concat(file)
                        })
                      }
                    });
                    break;
                  
                  default:
                    break;
                }
              }
            });
          },
          clearFileList(){
            if(this.data.fileList.length==0){
                utils.Toast('没有待上传文件啦～',1500,'none')
                return 
            }
           this.setData({
               fileList:[]
           })
        },
        deleteFile(e) {
            const index = e.currentTarget.dataset.index;
            const newFileList = this.data.fileList.filter((_, i) => i !== index);
            this.setData({
              fileList: newFileList
            });
          },
        uploadFile(filePath) {
            if(this.data.fileList.length==0){
                utils.Toast('请选择文件',1500,'none')
                return
            }
            wx.showLoading({
                title: '上传中',
                mask: true
            })
           console.log(this.data.fileList[0])
            wx.uploadFile({
                url: api.imgtoword, // 替换为实际后端接口
                filePath: this.data.fileList[0].path,
                name: 'image',
                header: {
                    // 'Authorization': `Bearer ${wx.getStorageSync('access_token')}`,
                    'Content-Type': 'multipart/form-data'
                },
                success: (uploadRes) => {
                    const data = JSON.parse(uploadRes.data);
                    console.log(uploadRes)
                    if (data.file_url) {
                        utils.Toast('转换成功', 1500, 'success')
                        this.setData({
                            wordUrl: data.file_url,
                            showSuccessModal: true
                        });
                        this.downloadFile(data.file_url);
                    } else {
                        utils.Toast('upload fail', 1500, 'fail')
                    }
                },
                fail: (err) => {
                    console.log(err)
                    utils.Toast('上传失败', 1500, 'fail')
                    
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
          cutfilename(name){
            return name.length > 10 ? name.substring(0, 10) + '...' : name
        },
        downloadFile(url) {
            // const info = wx.getStorageSync('userInfo')
            // let name = info.username.replace(/[\p{P}\p{S}]/gu, "");
            let timestamp = utils.getFormattedTime()
            const fileName = `${timestamp}.docx`;
            this.setData({fileName:fileName})
            wx.downloadFile({
                url: url,
                success: (res) => {
                    console.log(res)
                    if (res.statusCode === 200) {
                        wx.showToast({
                            title: '下载成功',
                            icon: 'success',
                            duration: 1500
                        });
                        const files = wx.getStorageSync('savedFiles') || [];
                        files.push({
                            name: fileName,
                            path: res.tempFilePath,
                            type:'WORD'
                        });
                        wx.setStorageSync('savedFiles', files);
                        this.loadFileList();
                        
                    } else {
                        utils.Toast('下载失败', 1500, 'fail')
                    }
                },
                fail: (err) => {
                    utils.Toast('下载失败', 1500, 'fail')
                    
                }
            });
        },
        openFile(e) {
            const filePath = e.currentTarget.dataset.path;
            const fileType = filePath.split('.').pop(); // 提取后缀名
            wx.openDocument({
                filePath: filePath,
                fileType: fileType,
                success: () => {
                    utils.Toast('打开文档成功',1500,'none');
                },
                fail: (err) => {
                    wx.showToast({
                        title: '打开失败',
                        icon: 'none'
                    });
                    utils.Toast('打开文档失败', 1500,'none');
                }
            });
        }
    }
})