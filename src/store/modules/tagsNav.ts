import { VuexModule, Module, Action, getModule, Mutation } from 'vuex-module-decorators'
import store from '@/store'
import { Route } from 'vue-router'
// 泛型：Partial工具。作用：把Route里面的值都变成可选项 ?
export interface ITagNav extends Partial<Route>{
    title?: string
    fullPath?: string
}

export interface ITagsNavState {
    visitedTag: ITagNav[]
    cachedTag: (string | undefined)[] // 使用keep-alive缓存的组件名字
}

@Module({ namespaced: true, dynamic: true, store, name: 'TagsNav' })
class TagsNav extends VuexModule implements ITagsNavState {
    public visitedTag: ITagNav[] = []
    public cachedTag: (string | undefined)[] = ['Level_1']
    @Mutation
    private ADD_VISITED_TAG(route: ITagNav) {
        // 判断当前点击的路由是否已经存在，并且当前点击路由的参数是否和已经存在的路由参数相同。不同则更新
        const bool = this.visitedTag.some((v, index) => v.path === route.path)
        if (bool) {
            this.visitedTag = this.visitedTag.map(item => {
                if (item.path === route.path) {
                    item.query = route.query
                    item.fullPath = route.fullPath
                }
                return item
            })
            return
        }
        this.visitedTag.push(
            Object.assign({}, route, {
                title: route.meta.title || 'no-name'
            })
        )
    }
    @Mutation
    private DEL_VISITED_TAG(route: ITagNav) {
        for (const [i, v] of this.visitedTag.entries()) {
            if (v.path === route.path) {
                this.visitedTag.splice(i, 1)
                break
            }
        }
    }
    @Mutation
    private ADD_CACHED_VIEW(route: ITagNav) {
        if (route.name === null) return
        if (this.cachedTag.includes(route.name)) return
        if (!route.meta.noCache) {
            this.cachedTag.push(route.name)
        }
    }
    @Mutation
    private DEL_CACHED_VIEW(route: ITagNav) {
        if (route.name === null) return
        const index = this.cachedTag.indexOf(route.name)
        index > -1 && this.cachedTag.splice(index, 1)
    }
    @Mutation
    private DEL_ALL_VISITED_TAG() {
        const affixTags = this.visitedTag.filter(tag => tag.meta.affix)
        this.visitedTag = affixTags
    }
    @Mutation
    private DEL_ALL_CACHED_TAG() {
        this.cachedTag = []
    }
    // 增加tag
    @Action({ rawError: true })
    public addTag(route: ITagNav) {
        this.ADD_VISITED_TAG(route)
        this.ADD_CACHED_VIEW(route)
    }
    // 删除tag
    @Action({ rawError: true })
    public delTag(route: ITagNav) {
        this.DEL_VISITED_TAG(route)
        this.DEL_CACHED_VIEW(route)
    }
    // 删除所有tag
    @Action({ rawError: true })
    public delAllTag() {
        this.DEL_ALL_VISITED_TAG()
        this.DEL_ALL_CACHED_TAG()
    }
    // 增加默认的tag
    @Action({ rawError: true })
    public addVisitedTag(route: ITagNav) {
        this.ADD_VISITED_TAG(route)
    }
}

export const TagModule = getModule(TagsNav)
