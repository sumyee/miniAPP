/**
 * 请求接口 
 * 配置文件
 */

// var host = "https://test-api.nightstation.cn/v1"
var host = "https://api.nightstation.cn/v1"

var config = {

  host,

  // 登录地址
  loginUrl: host + '/wechat/mini-pg-login',

  // 附近夜店
  nearmeStations: host + '/stations/nearme',

  // 夜店
  stations: host + '/stations',

  // 取消点赞
  unlike: host + '/feeds/cancel',

  // 夜店评论、点赞
  feeds: host + '/feeds',

  // 获取夜店评论列表
  stationsFeeds: host + '/stations/feeds',

  // 驻场顾问列表
  advisers: host + '/role/advisers',

  // 预约订台
  reserve: host + '/reserve',

  // 取消预约订台
  cancelReserve: host + '/reserve/cancel',

  // 提交
  orders: host + '/orders',

  // 获取微信支付签名
  signature: host + '/wxpay/signature',
  
  // 某商家是否有预约订台
  stations_reserve: host + '/stations/reserve',

  // 获取城市列表
  cityUrl: host + '/cities/list',

  // 夜店酒水
  products: host + '/products/list',

  // 用户订台中的商家列表
  reserve_stations: host + '/reserve/stations'
};

module.exports = config
