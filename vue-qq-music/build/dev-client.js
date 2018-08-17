require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')
// 监听事件发送自动更新
hotClient.subscribe(function(event) {
  if(event.action === 'reload') {
    window.location.reload()
  }
})