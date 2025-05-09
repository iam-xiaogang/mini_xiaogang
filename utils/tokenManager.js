// utils/tokenManager.js
import api from '../config/setting'
const REFRESH_URL = api.refresh  // ✅ 替换成你的刷新接口
let refreshInterval = null

function getAccessToken() {
  return wx.getStorageSync('access_token') || ''
}

function setAccessToken(token) {
  wx.setStorageSync('access_token', token)
}

function getRefreshToken() {
  return wx.getStorageSync('refresh_token') || ''
}

function setRefreshToken(token) {
  wx.setStorageSync('refresh_token', token)
}

// 自动刷新 token
function startTokenAutoRefresh() {
  if (refreshInterval) clearInterval(refreshInterval)
  refreshInterval = setInterval(() => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      return
    }
    const token = wx.getStorageSync('access_token')
    wx.request({
      url: REFRESH_URL,
      method: 'POST',
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      data: {
        refresh: refreshToken
      },
      success: (res) => {
          
        if (res.statusCode == 200) {
           
          setAccessToken(res.data.access_token)
          
        } else {
          clearTokenAndRedirect()
        }
      },
      fail: () => {
        clearTokenAndRedirect()
      }
    })
  }, 1000 * 60 * 10) // 每 10 分钟刷新一次
}

function clearTokenAndRedirect() {
  wx.removeStorageSync('access_token')
  wx.removeStorageSync('refresh_token')
  wx.showToast({
    title: '身份过期，请重新登录',
    icon: 'none',
    duration: 1500
  })
  setTimeout(() => {
    wx.redirectTo({
      url: '/pages/phonelogin/phonelogin'
    })
  }, 1500)
}

module.exports = {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  startTokenAutoRefresh
}
