/**
 * 获取新闻列表
 */
import request from '@/utils/request'
// 获取新闻列表
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
// 对此新闻不感兴趣
export const dislikesArticle = (ArticleId) => {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/dislikes`,
    data: {
      target: ArticleId
    }
  })
}
// 举报当前新闻
export const reportsArticle = ({ target, type, remark = '' }) => {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/reports`,
    data: {
      target, // 举报的文章id
      type, // 举报类型
      remark // 其他问题 的附加说明
    }
  })
}
