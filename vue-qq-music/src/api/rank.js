import {jsonp} from 'common/js/jsonp'
import {options, commonParams} from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    _: 1534838064304
  })
  return jsonp(url, data, options)
}