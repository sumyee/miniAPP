const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 数组去重
const unique = (arr) => {
  return Array.from(new Set(arr))
}

// 获取几天后的日期
const getMoreDate = (str, num) => {
  var now = str ? new Date(str) : new Date()
  now.setDate(now.getDate() + num)
  const month = now.getMonth() + 1
  const day = now.getDate()
  return [month, day].map(formatNumber).join('-')
}

// 获取几天后的年月日
const getMoreYMD = (str, num) => {
  var now = str ? new Date(str) : new Date()
  now.setDate(now.getDate() + num)
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const isEmptyObject = (e) => {
  var t;
  for (t in e)
    return !1;
  return !0
}

module.exports = {
  formatTime: formatTime,
  getMoreDate: getMoreDate,
  getMoreYMD: getMoreYMD,
  unique: unique,
  isEmptyObject: isEmptyObject
}
