// utils/request.js
const tokenManager = require('./tokenManager')

  

function request({ url, method = 'GET', data = {}, header = {} }) {
  const token = tokenManager.getAccessToken()

  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...header
      },
      success(res) {
        if (res.statusCode === 401) {
          tokenManager.clearTokenAndRedirect()
          return reject('401 Unauthorized')
        }
        resolve(res)
      },
      fail(err) {
        wx.showToast({ title: '请求失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

module.exports = request
