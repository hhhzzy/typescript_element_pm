import Cookies from 'js-cookie'

// 判断是否是外链链接
export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

// APP
// 保存左侧菜单是否打开还是关闭
const sidebarStatus = 'sidebar_status'
export const setSidebarStatus = (toogleStatus: string) => Cookies.set(sidebarStatus, toogleStatus)
export const getSidebarStatus = () => Cookies.get(sidebarStatus)
