Component({
    properties: {
      title: {
        type: String,
        value: "默认标题"
      }
    },
    data: {
      statusBarHeight: 0,
      navBarHeight: 44 + 20 // 默认值，可自适应
    },
    lifetimes: {
      attached() {
        const systemInfo = wx.getSystemInfoSync();
        const menuButton = wx.getMenuButtonBoundingClientRect();
        const statusBarHeight = systemInfo.statusBarHeight;
        const navBarHeight = menuButton.bottom + menuButton.top - statusBarHeight;
  
        this.setData({
          statusBarHeight,
          navBarHeight
        });
      }
    }
  });
  