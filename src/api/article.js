/**
 * 获取新闻列表
 */
import request from '@/utils/request'
export const gainArticle = ({ channelId, timestamp, withTop }) => {
  return request({
    method: 'GET',
    url: `/app/v1_1/articles`,
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}
