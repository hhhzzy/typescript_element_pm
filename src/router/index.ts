
import router from './router'
import NProgress from 'nprogress'
import { Route } from 'vue-router'
import Router from 'vue-router'
import 'nprogress/nprogress.css'

import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'

// 定义进度条
NProgress.configure({ showSpinner: false })

router.beforeEach(async(to: Route, from: Route, next: any) => {
    // 进度条开始
    NProgress.start()
    // 判断是否登录（是否有token）
    const hasToken: string = UserModule.token
    if (hasToken) {
        // 登录成功，输入登录页面自动跳到首页
        if (to.path === '/login') {
            next('/')
            NProgress.done()
        } else {
            /**
             * 判断是否有用户数据
             * 1.没有：没有用户数据 => 第一次登录，需要获取用户数据
             * 2.有：已经登录成功 => 只需要跳转路由
             */
            const hasRole = UserModule.roles
            if (hasRole.length === 0) {
                // 获取用户角色
                await UserModule.GetUserInfo()
                const roles = UserModule.roles
                // 根据角色权限动态获取路由
                PermissionModule.GetAddRouters(roles)
                const accessRoutes = PermissionModule.routes;
                /**
                 * 因为路由动态加载，每次在添加的时候没有删除原有的路由，所以每次在添加的时候要删除原有的路由
                 * 解决路由重复问题：vue-router.esm.js?8c4f:16 [vue-router] Duplicate named routes definition
                 */
                (router as any).matcher = (new Router() as any).matcher
                accessRoutes.forEach(route => {
                    router.addRoute(route)
                })
                // hack方法 确保addRoutes已完成
                // 设置replace：true。确保导航不会留下历史记录
                if (to.path === to.query.redirect) {
                    router.replace(to.path)
                } else {
                    next({ ...to, replace: true })
                }
            } else {
                next()
            }
        }
    } else {
        /**
         * 跳转到登录页面
         * 判断进入的页面是否为login，否则会造成死循环
         * 离开当前页面的时候带上当前页面的路由，以便登录成功后返回该页面
         */
        if (to.path !== '/login') {
            next(`/login?redirect=${to.path}`)
        } else {
            next()
        }
    }
})
router.afterEach((to: Route) => {
    // 停止进度条
    NProgress.done();
    (document.getElementById('loading') as any).style.display = 'none'
})

export default router
