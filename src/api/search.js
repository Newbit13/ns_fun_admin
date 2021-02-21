import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/search/list',
    method: 'get',
    params: query
  })
}

export function del(data) {
  return request({
    url: '/admin/search/del',
    method: 'post',
    data
  })
}

