import Vue from 'vue'
import Vuex from 'vuex'

import { IUserState } from './modules/user'
import { IPermissionState } from './modules/permission'

Vue.use(Vuex)
export interface IRootState {
    user: IUserState
    permission: IPermissionState
}
export default new Vuex.Store<IRootState>({
    // state: {
    // },
    // mutations: {
    // },
    // actions: {
    // },
    // modules: {
    //     IUserState
    // }
})
