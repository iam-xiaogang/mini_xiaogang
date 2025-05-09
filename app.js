// app.js
const tokenManager = require('./utils/tokenManager')
App({
    onLaunch() {
        tokenManager.startTokenAutoRefresh()
      }
})
