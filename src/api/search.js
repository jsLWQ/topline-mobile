import request from '@/utils/request'
// 联想建议
export const suggeStion = q => {
  return request({
    method: 'GET',
    url: `/app/v1_0/suggestion`,
    params: {
      q
    }
  })
}
