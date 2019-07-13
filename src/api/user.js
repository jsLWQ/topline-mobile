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
