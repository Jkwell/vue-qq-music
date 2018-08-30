import axios from 'axios'
import {commonParams} from './config'

export default function getLyric(songmid) {
  const url = '/api/getlyric'
  const data = Object.assign({}, commonParams, {
    songmid: songmid,
    pcachetime: +new Date(),
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}