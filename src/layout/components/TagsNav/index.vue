<template>
    <div class="tags-view-container">
        <scroll-nav
            ref="scrollNav"
            class="tags-view-wrapper"
        >
            <router-link
                v-for="tag in visitedTag"
                :key="tag.path"
                ref="tag"
                :to="{path: tag.path, query: tag.query, fullPath: tag.fullPath}"
                class="tag-a"
            >
                <el-tag
                    :closable="!tag.meta.affix"
                    :disable-transitions="false"
                    size="small"
                    :effect="isActive(tag) ? 'dark' : 'plain'"
                    @close.prevent.stop="closeTag(tag,$event)"
                >
                    {{ tag.title }}{{ tag.affix }}
                </el-tag>
            </router-link>
        </scroll-nav>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import ScrollNav from './scrollNav.vue'
import Route, { RouteConfig } from 'vue-router'
import path from 'path'
import { TagModule, ITagNav } from '@/store/modules/tagsNav'
import { PermissionModule } from '@/store/modules/permission'
@Component({
    name: 'TagsNav',
    components: {
        ScrollNav
    }
})
export default class TagsNav extends Vue {
    private affixTags: ITagNav[] = []
    @Watch('$route')
    private onRouteChange(route: Route) {
        this.addTags()
        this.moveToCurrentTag()
    }
    // 获取所有的路由
    get routes() {
        return PermissionModule.routes
    }
    // 获取tag
    get visitedTag() {
        return TagModule.visitedTag
    }
    mounted() {
        // 初始化tag
        this.initTags()
        // 增加tag
        this.addTags()
    }
    // 增加tag，对应增加路由
    private addTags() {
        TagModule.addTag(this.$route)
    }
    // 初始化tag
    private initTags() {
        this.affixTags = this.filterAffixTags(this.routes)
        for (const tag of this.affixTags) {
            if (tag.name) {
                TagModule.addVisitedTag(tag)
            }
        }
    }
    // 关闭tag
    private closeTag(tag: ITagNav, e: any) {
        TagModule.delTag(tag)
        if (this.isActive(tag)) {
            this.toLastView(TagModule.visitedTag, tag)
        }
    }
    // 判断当前tag是否选中
    private isActive(tag: ITagNav) {
        return tag.path === this.$route.path
    }
    // 移动到最后一个tag
    private toLastView(visitedTsg: ITagNav[], route: ITagNav) {
        const latestTag = visitedTsg.slice(-1)[0]
        if (latestTag !== undefined && latestTag.fullPath !== undefined) {
            this.$router.push(latestTag.fullPath).catch(err => {
                console.warn(err)
            })
        } else {
            // 如果没有路由，则默认定向到主页
            if (route.name === 'home') {
                this.$router.replace({ path: '/redirect' + route.fullPath }).catch(err => {
                    console.warn(err)
                })
            } else {
                this.$router.push('/').catch(err => {
                    console.warn(err)
                })
            }
        }
    }
    // 循环出路由中meta属性中affix为true的路由
    private filterAffixTags(routes: RouteConfig[], basePath = '/') {
        let tags: ITagNav[] = []
        routes.forEach(route => {
            if (route.meta && route.meta.affix) {
                const tagPath = path.resolve(basePath, route.path)
                tags.push({
                    fullPath: tagPath,
                    path: tagPath,
                    name: route.name,
                    meta: { ...route.meta }
                })
            }
            if (route.children) {
                const childTags = this.filterAffixTags(route.children, route.path)
                if (childTags.length >= 1) {
                    tags = [...tags, ...childTags]
                }
            }
        })
        return tags
    }
    private moveToCurrentTag() {
        const tags = this.$refs.tag as any[]
        this.$nextTick(() => {
            for (const tag of tags) {
                if ((tag.to as ITagNav).path === this.$route.path) {
                    (this.$refs.scrollNav as ScrollNav).moveToTarget(tag as any)
                    // When query is different then update
                    // if ((tag.to as ITagNav).fullPath !== this.$route.fullPath) {
                    //     TagsViewModule.updateVisitedView(this.$route)
                    // }
                    break
                }
            }
        })
    }
}
</script>
<style lang="less" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
  .el-tag {
    border-radius: 1px;
  }
  .tag-a{
    margin-left: 10px;
    margin-top: 5px;
    border-radius: 1px;
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    &:last-of-type{
        margin-right: 40px;
    }
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
