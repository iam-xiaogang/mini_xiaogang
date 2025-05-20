const api = require('../config/setting');

function formatChineseDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
  
    return `${year}年${month}月${day}号 ${hour}点${minute < 10 ? '0' + minute : minute}`;
  }
  // utils/auth.js

  function relogin() {
    wx.removeStorageSync('access_token');
    wx.removeStorageSync('refresh_token');
    // wx.showToast({ title: '请重新登录', icon: 'none' });
    
    // 跳转到登录页面（假设是 /pages/login/login）
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }, 1500);
  }
  
  module.exports = {
    refreshToken,
    relogin
  };
  
function refreshToken() {
  return new Promise((resolve, reject) => {
    const refreshToken = wx.getStorageSync('refresh_token');
    if (!refreshToken) {
      relogin()
      reject('没有 refresh_token');
      return;
    }

    wx.request({
      url: api.refresh,
      method: 'POST',
      data: { refresh: refreshToken },
      success(res) {
        if (res.statusCode === 200) {
          const newAccessToken = res.data.access_token;
          wx.setStorageSync('access_token', newAccessToken);
          resolve(newAccessToken);
        } else {
            relogin()
          reject('refresh token 已失效，请重新登录');
        }
      },
      fail(err) {
        relogin()
        reject('网络错误');
      }
    });
  });
}
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
  
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
  
    if (seconds < 60) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
  
    return date.toLocaleDateString();
  }
  
function Toast(title,duration,icon){
    wx.showToast({
      title,
      duration,
      icon
    })
}
function getFormattedTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
  
    return `${year}${month}${day}${hour}${minute}`;
  }
  
  const timeString = getFormattedTime();
  console.log('格式化时间：', timeString);
  
  module.exports = {
    refreshToken,
    formatChineseDate,
    relogin,
    formatTimeAgo,
    Toast,
    getFormattedTime
  };