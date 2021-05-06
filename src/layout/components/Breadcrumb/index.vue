<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in breadcrumbs" :key="index">
                <span
                    v-if="item.redirect == 'noredirect' || index === breadcrumbs.length-1"
                    class="no-redirect"
                >{{ item.meta.title }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Route, RouteRecord } from 'vue-router'
import { compile } from 'path-to-regexp'
@Component({
    name: 'Breadcrumb'
})
export default class Breadcrumb extends Vue {
    private breadcrumbs: RouteRecord[] = []
    @Watch('$route')
    private onRouteChange(route: Route) {
        if (route.path.startsWith('/redirect/')) {
            return
        }
        this.getBreadcrumb()
    }
    created() {
        // 获取面包屑上的路由
        this.getBreadcrumb()
    }
    getBreadcrumb() {
        let matched = this.$route.matched.filter((item) => item.meta && item.meta.title)
        const first = matched[0]
        if (!this.isDashboard(first)) {
            matched = [{ path: '/home', meta: { title: '首页' }} as RouteRecord].concat(matched)
        }
        this.breadcrumbs = matched.filter((item) => {
            return item.meta && item.meta.title && item.meta.breadcrumb !== false
        })
    }
    // 判断路由中有没有首页路由
    private isDashboard(route: RouteRecord) {
        const name = route && route.name
        if (!name) {
            return false
        }
        return name.trim().toLocaleLowerCase() === 'Home'.toLocaleLowerCase()
    }
    private pathCompile(path: string) {
        // 解决这个问题：https://github.com/PanJiaChen/vue-element-admin/issues/561
        const { params } = this.$route
        const toPath = compile(path)
        return toPath(params)
    }
    // 点击进入路由
    private handleLink(item: any) {
        console.log(item)
        console.log(this.pathCompile(item.path))
        const { redirect, path } = item
        if (redirect) {
            this.$router.push(redirect).catch(err => {
                console.warn(err)
            })
            return
        }
        this.$router.push(this.pathCompile(path)).catch(err => {
            console.warn(err)
        })
    }
}
</script>
<style lang="less" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
