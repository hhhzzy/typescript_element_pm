<template>
    <div
        v-if="!route.meta || !route.meta.hidden"
        :class="[mode === 'vertical'? (isCollapse ? 'close-mode' : 'open-mode') : 'horizontal-mode', {'first-level': isFirstLevel}]"
    >
        <!--   没有子路由。alwaysShow为false：只显示根路由    -->
        <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
            <sidebar-item-link
                v-if="theOnlyOneChild.meta"
                :to-path="resolvePath(theOnlyOneChild.path)"
            >
                <el-menu-item
                    :index="resolvePath(theOnlyOneChild.path)"
                    :class="{'submenu-title-noDropdown': isFirstLevel}"
                >
                    <svg-icon
                        v-if="theOnlyOneChild.meta.icon && mode == 'vertical'"
                        :name="theOnlyOneChild.meta.icon"
                    />
                    <span
                        v-if="theOnlyOneChild.meta.title"
                        slot="title"
                    >{{ theOnlyOneChild.meta.title }}</span>
                </el-menu-item>
            </sidebar-item-link>
        </template>
        <el-submenu
            v-else
            :index="resolvePath(route.path)"
            popper-append-to-body
        >
            <template slot="title">
                <svg-icon v-if="route.meta && route.meta.icon && mode == 'vertical'" :name="route.meta.icon" />
                <span v-if="route.meta && route.meta.title" slot="title">{{ route.meta.title }}</span>
            </template>
            <template v-if="route.children">
                <sidebar-item
                    v-for="(item,index) in route.children"
                    :key="index"
                    :is-collapse="isCollapse"
                    :route="item"
                    :is-first-level="false"
                    :base-path="resolvePath(item.path)"
                    class="nest-menu"
                />
            </template>
        </el-submenu>
    </div>
</template>
<script lang="ts">
import path from 'path'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { isExternal } from '@/utils/global'

import SidebarItemLink from './SidebarItemLink.vue'
import { AppModule } from '@/store/modules/app'

@Component({
    name: 'SidebarItem',
    components: {
        SidebarItemLink
    }
})

export default class SidebarItem extends Vue {
    @Prop({ default: false }) private isCollapse!: boolean
    @Prop({ required: true }) private route!: RouteConfig
    @Prop({ default: '' }) private basePath!: string
    @Prop({ default: true }) private isFirstLevel!: boolean

    // 是否显示嵌套路由。
    get alwaysShowRootMenu() {
        if (this.route.meta && this.route.meta.alwaysShow) {
            return true
        }
        return false
    }
    // 计算路由下面的子路由的个数
    get showingChildNumber() {
        if (this.route.children) {
            const showingChildren = this.route.children.filter((item) => {
                if (item.meta && item.meta.hidden) {
                    return false
                } else {
                    return true
                }
            })
            return showingChildren.length
        }
        return 0
    }
    get theOnlyOneChild() {
        if (this.showingChildNumber > 1) {
            return null
        }
        if (this.route.children) {
            for (const child of this.route.children) {
                if (!child.meta || !child.meta.hidden) {
                    return child
                }
            }
        }
        return { ...this.route, path: '' }
    }
    // 组合route中的path
    private resolvePath(routePath: string) {
        if (isExternal(routePath)) {
            return routePath
        }
        if (isExternal(this.basePath)) {
            return this.basePath
        }
        return path.resolve(this.basePath, routePath)
    }
    get mode() {
        return AppModule.sidebar.mode
    }
    mounted() {
    }
}
</script>
<style lang="less">
.el-submenu.is-active > .el-submenu__title {
  color: #f4f4f5!important;
  i{
    color: #f4f4f5!important;
  }
}
.open-mode {
  .nest-menu .el-submenu>.el-submenu__title,
  .el-submenu .el-menu-item {
    min-width: 210px!important;
    background-color: #1f2d3d!important;

    &:hover {
      background-color: #001528!important;
    }
  }
}
.close-mode {
  &.first-level {
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;
      }
    }

    .el-submenu {
      overflow: hidden;

      &>.el-submenu__title {
        padding: 0px !important;

        .el-submenu__icon-arrow {
          display: none;
        }

        &>span {
          visibility: hidden;
        }
      }
    }
  }
}
.el-menu--horizontal .horizontal-mode.first-level{
    float: left;
    span{
        padding: 0 20px;
    }
    i{
        margin-top: -4px;
    }
    .el-menu-item.is-active{
        border-bottom: 3px solid rgb(64, 158, 255);
    }
    .el-submenu.is-active .el-submenu__title{
        border-bottom: 3px solid rgb(64, 158, 255);
    }
}
</style>
<style lang="less" scoped>
.svg-icon {
  margin-right: 16px;
}

.close-mode {
  .svg-icon {
    margin-left: 20px;
    font-size: 16px;
  }
}
</style>
