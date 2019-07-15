/**
 * 获取用户相关的
 *
 */

import request from '@/utils/request.js'
// 登录
export const userLogin = ({ mobile, code }) => {
  return request({
    method: 'POST',
    url: `/app/v1_0/authorizations`,
    data: {
      mobile,
      code
    }
  })
}
// 拉黑用户
export const blackLists = userID => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/blacklists',
    data: {
      target: userID
    }
  })
}
