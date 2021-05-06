import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { asyncRouter, constRouter } from '@/router/router'
import { RouteConfig } from 'vue-router'
import store from '@/store'
export interface IPermissionState {
    routes: RouteConfig[]
    dynamicRoutes: RouteConfig[]
}

/**
 * 通过权限筛选出可以访问的路由
 * @param {*} routes 传过来的所有需要权限验证的路由
 * @param {*} roles  用户所具有的的权限
 */
export function filterRouter(routes: RouteConfig[], roles: string[]) {
    const res: RouteConfig[] = []
    routes.forEach(item => {
        const tmp = { ...item }
        if (getPermission(tmp, roles)) {
            if (item.children) {
                tmp.children = filterRouter(item.children, roles)
            }
            res.push(tmp)
        }
    })
    return res
}
/**
 * 判断该用户是否可以访问该路由，有权限返回true
 * @param {*} route 单个路由
 * @param {*} roles 用户的权限
 */
export function getPermission(route: RouteConfig, roles: string[]) {
    if (route && route.meta) {
        return roles.some(value => {
            return route.meta.roles.includes(value)
        })
    } else {
        return true
    }
}
@Module({ namespaced: true, dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
    public routes: RouteConfig[] = []
    public dynamicRoutes: RouteConfig[] = []

    @Mutation
    private SET_ROUTERS(routes: RouteConfig[]) {
        this.routes = constRouter.concat(routes)
        this.dynamicRoutes = routes
    }
    /**
     * 计算动态路由
     */
    @Action({ rawError: true })
    public async GetAddRouters(roles: string[]) {
        let accessRouter
        if (roles.includes('admin')) { // 超级管理员
            accessRouter = asyncRouter
        } else { // 其他角色
            accessRouter = filterRouter(asyncRouter, roles)
        }
        console.log(accessRouter, 63)
        this.SET_ROUTERS(accessRouter)
    }
}
export const PermissionModule = getModule(Permission)
