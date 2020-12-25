// 导航守卫
import router from './router'
import { resetRouter, constantRoutes } from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getSession } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条设置，右侧圆形加载是否显示

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // 滚动条开始加载
  NProgress.start()

  // 设置页面title
  document.title = getPageTitle(to.meta.title)

  // 判断用户是否登录
  const hasToken = getSession('token')
  let stateFirst = true
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // 滚动条加载完成
    } else {
      next()
      NProgress.done()
      // const hasGetUserInfo = store.getters.name
      // if (hasGetUserInfo) {
      //   next()
      // } else {
      //   try {
      //     await store.dispatch('user/getInfo')
      //     next()
      //   } catch (error) {
      //     // 移除token，重新登录
      //     await store.dispatch('user/resetSession')
      //     Message.error(error || 'Has Error')
      //     next(`/login?redirect=${to.path}`)
      //     NProgress.done()
      //   }
      // }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
