// components/pdfadd/pdfadd.js
import api from '../../config/setting'
const utils = require('../../utils/utils')
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
        mergedList: [],
        fileList: [],
        showSuccessModal:false,
        filePath:'',
        fileName:''
    },

    /**
     * 组件的方法列表
     */
    lifetimes:{
        created(){
            this.loadPdfFile()
        },
    },
    methods: {
        cutfilename(name){
            return name.length > 10 ? name.substring(0, 10) + '...' : name
        },
        onPullDownRefresh() {
            this.clearFileList(); // 自定义数据加载方法
            wx.stopPullDownRefresh(); // 停止刷新动画
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
        chooseFiles() {
            const that = this;
            wx.showActionSheet({
              itemList: ['拍照', '从相册选择图片', '选择 PDF 文件'],
              success(res) {
                switch (res.tapIndex) {
                  case 0:
                    // 拍照
                    wx.chooseImage({
                      count: 1,
                      sourceType: ['camera'],
                      success: imgRes => {
                        const files = imgRes.tempFiles.map(path => ({
                          path:path.path,
                          name: that.cutfilename(path.path.split('/').pop()),
                          type: 'image'
                        }));
                        that.setData({
                          fileList: that.data.fileList.concat(files)
                        });
                      }
                    });
                    break;
                  case 1:
                    // 相册
                    wx.chooseImage({
                      count: 9,
                      sourceType: ['album'],
                      success: imgRes => {
                          
                        const files = imgRes.tempFiles.map(path => ({
                          path:path.path,
                          name: that.cutfilename(path.path.split('/').pop()),
                          type: 'image'
                        }));
                        that.setData({
                          fileList: that.data.fileList.concat(files)
                        });
                      }
                    });
                    break;
                  case 2:
                    // PDF 文件
                    wx.chooseMessageFile({
                      count: 10,
                      type: 'file',
                      extension: ['pdf'],
                      success: fileRes => {
                        const pdfs = fileRes.tempFiles.map(file => ({
                            path: file.path,
                            name: that.cutfilename(file.name),
                            type: 'pdf'
                          }));
                        that.setData({
                          fileList: that.data.fileList.concat(pdfs)
                        });
                      }
                    });
                    break;
                  default:
                    break;
                }
              }
            });
          },
          
          
        downloadFile(url) {
            // const info = wx.getStorageSync('userInfo')
            // let name = info.username.replace(/[\p{P}\p{S}]/gu, "");
            let timestamp = utils.getFormattedTime()
            const fileName = `${timestamp}.pdf`;
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
                        this.loadPdfFile();
                        
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
        },
    
        loadPdfFile() {
            const files = wx.getStorageSync('savedFiles') || [];
            const filterfiles = files.filter(file => file.name.endsWith(".pdf"));
            this.setData({
                mergedList: filterfiles
            });
        },
        closeModal() {
            this.setData({ showSuccessModal: false });
          },
          copyLink() {
            wx.setClipboardData({
              data: this.data.filePath,
              success() {
                wx.showToast({ title: '链接已复制', icon: 'none' });
              }
            });
          },
        uploadAndMergePDFs() {
            const fileList = this.data.fileList;
            const token = wx.getStorageSync('access_token')
            console.log(fileList)
            const uploadedPaths = [];
            const uploadNext = (index) => {
                if (index >= fileList.length) {
                    // 所有文件上传完毕，开始合并
                    console.log(uploadedPaths)
                    wx.request({
                        url: api.mergepdf,
                        method: 'POST',
                        header: {
                            'content-type': 'application/json',
                            'Authorization': token ? `Bearer ${token}` : '',
                        },
                        data: {
                            file_paths: uploadedPaths
                        },
                        success: res => {
                            this.setData({
                                showSuccessModal:true,
                                filePath:res.data.file_url
                            })
                            // this.copyLink(res.data.file_url)
                            this.downloadFile(res.data.file_url)
                            
                        }
                    });
                    return;
                }

                wx.uploadFile({
                    url: api.updatepdf,
                    filePath: fileList[index].path,
                    name: 'files',
                    header: {
                        'Authorization': token ? `Bearer ${token}` : '',
                    },
                    success: res => {
                        console.log(res.data)
                        const result = JSON.parse(res.data);
                        uploadedPaths.push(result.file_path);
                        uploadNext(index + 1); // 上传下一个
                    },
                    fail: err => {
                        console.error('上传失败', err);
                    }
                });
            };

            uploadNext(0); // 从第一个开始上传
        }
    }
    
})