/**
 * 获取频道列表
 */
import request from '@/utils/request'
// 获取频道列表
export const gainChannels = () => {
  return request({
    method: 'GET',
    url: `/app/v1_0/user/channels`
  })
}

// 获取全部的频道列表
export const gainAllChannels = () => {
  return request({
    method: 'GET',
    url: `/app/v1_0/channels`
  })
}
// 添加频道-重置式
export const addChannels = (channels) => {
  return request({
    method: 'PUT',
    url: `/app/v1_0/user/channels`,
    data: {
      channels: channels
    }
  })
}
export const delChannel = ({ id }) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${id}`
  })
}
