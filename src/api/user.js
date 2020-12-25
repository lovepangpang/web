import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys/login/login',
    method: 'post',
    data
  })
}

// 获取菜单
export function getList() {
  return request({
    url: '/sys/login/initLeftMenu',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
