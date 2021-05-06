
import Cookie from 'js-cookie'

// token
const tokenKey = 'hzy_element_typescript_token'
export const getToken = () => Cookie.get(tokenKey)
export const setToken = (token: string) => Cookie.set(tokenKey, token)
export const removeToken = () => Cookie.remove(tokenKey)

// 保存菜单栏模式
const sidebarType = 'sidebarType'
export const setSidebarType = (type: string) => Cookie.set(sidebarType, type)
export const getSidebarType = () => Cookie.get(sidebarType)
