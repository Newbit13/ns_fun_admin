const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': [1, 2],//['上架', '下架']
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    logo:image_uri,
    platforms: ['a-platform'],
    pv: '@integer(0, 66)',
    uv: '@integer(0, 88)',
  }))
}

module.exports = [
  {
    url: '/admin/product/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/admin/product/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const product of List) {
        if (product.id === +id) {
          return {
            code: 200,
            data: product
          }
        }
      }
    }
  },

  {
    url: '/admin/product/pvuv',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: [
          { name: 'xx', pv: 1024,uv:888,tel:'777666' },
          { name: 'zz', pv: 1024,uv:888,tel:'777666' },
          { name: 'll', pv: 1024,uv:888,tel:'777666' },
          { name: 'qqq', pv: 1024,uv:888,tel:'777666' }
        ]
      }
    }
  },

  {
    url: '/admin/product/create',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },

  {
    url: '/admin/product/update',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/admin/product/changestate',
    type: 'post',
    response: config => {
      const { id,status } = config.body
      for (const product of List) {
        if (product.id === +id) {
          product.status = status
        }
      }
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]

