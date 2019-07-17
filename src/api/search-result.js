import request from '@/utils/request'

// 获取搜索结果
export const searchResult = ({ page, perPage, q }) => {
  return request({
    method: 'GET',
    url: `/app/v1_0/search`,
    params: {
      page,
      per_page: perPage,
      q
    }
  })
}
