import originJsonp from 'jsonp'

export function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}

export function urlParse() {
  let url = window.location.search
  let obj = {}
  let reg = /[?&][^?&]+ = [^?g]+/g
  let arr = url.match(reg)
  if (arr) {
    arr.forEach((item) => {
      let itemArr = item.substring(1).splite('=')
      let key = decodeURIComponent(itemArr[0])
      let value = decodeURIComponent(itemArr[1])
      obj[key] = value
    })
  }
  return obj
}