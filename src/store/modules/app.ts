import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'

import store from '@/store'
import { setSidebarStatus, getSidebarStatus } from '@/utils/global'
import { setSidebarType, getSidebarType } from '@/utils/cookies'

export interface IAppState{
    sidebar:{
        opened: boolean
        mode: string | undefined
    }
}
@Module({ namespaced: true, dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
    public sidebar = {
        opened: getSidebarStatus() !== 'closed',
        mode: getSidebarType() === undefined ? 'vertical' : getSidebarType()
    }
    @Mutation
    private TOOGLE_SIDEBAR() {
        this.sidebar.opened = !this.sidebar.opened
        if (this.sidebar.opened) {
            setSidebarStatus('opend')
        } else {
            setSidebarStatus('closed')
        }
    }
    @Mutation
    private SET_SIDEBAR_TYPE(value: string) {
        setSidebarType(value)
        this.sidebar.mode = value
    }
    // 纵向菜单切换和展开
    @Action({ rawError: true })
    public ToggleSideBar() {
        this.TOOGLE_SIDEBAR()
    }
    // 菜单栏横向还是纵向
    @Action({ rawError: true })
    public setSidebarType(value: string) {
        console.log(value)
        this.SET_SIDEBAR_TYPE(value)
    }
}
export const AppModule = getModule(App)
