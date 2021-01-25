import request from '@/utils/request'

export function fetchInfo(query) {
  return request({
    url: '/admin/api/dashboard/info',
    method: 'get',
    params: query
  })
}

export function fetchInfoByTime(query) {
  var timespanList = query.timespan;

  return request({
    url: '/admin/api/dashboard/search',
    method: 'get',
    params: {
      start_time:timespanList[0],
      end_time:timespanList[1],
    }
  })
}

