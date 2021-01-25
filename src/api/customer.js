import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/customer/list',
    method: 'get',
    params: query
  })
}

export function fetchCustomer(id) {
  return request({
    url: '/admin/customer/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/admin/customer/pv',
    method: 'get',
    params: { pv }
  })
}

export function createCustomer(data) {
  return request({
    url: '/admin/customer/create',
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: '/admin/customer/update',
    method: 'post',
    data
  })
}
