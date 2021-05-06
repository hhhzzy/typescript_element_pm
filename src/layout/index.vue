<template>
    <div
        class="layout"
        :class="classOther"
    >
        <Siderbar class="sidebar-container" :mode="mode" />
        <div class="main-container">
            <div class="fixed-header">
                <header-bar />
                <tags-nav />
            </div>
            <div class="app-container" style="height:1000px;">
                <keep-alive :include="cachedTags">
                    <router-view :key="key" />
                </keep-alive>
            </div>
        </div>
        <Setting />
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import { Siderbar, TagsNav, Setting } from './components'
import HeaderBar from './components/HeaderBar.vue'
import { AppModule } from '@/store/modules/app'
import { TagModule } from '@/store/modules/tagsNav'
@Component({
    name: 'Layout',
    components: {
        Siderbar,
        HeaderBar,
        TagsNav,
        Setting
    }

})
export default class Layout extends Vue {
    get classOther() {
        return {
            hideSidebar: AppModule.sidebar.mode === 'vertical' && !AppModule.sidebar.opened,
            openSidebar: AppModule.sidebar.mode === 'vertical' && AppModule.sidebar.opened,
            horizontalSidebar: AppModule.sidebar.mode === 'horizontal',
            verticalSidebar: AppModule.sidebar.mode === 'vertical'
        }
    }
    // 左侧菜单栏样式
    get mode() {
        return AppModule.sidebar.mode
    }
    get key() {
        return this.$route.path
    }
    // 可缓存的路由
    get cachedTags() {
        return TagModule.cachedTag
    }
}
</script>
<style lang="less" scoped>
.layout{
    position:relative;
    width: 100%;
    height: 100%;
}
.verticalSidebar{
    .sidebar-container{
        transition: width 0.28s;
        width: @sideBarWidth !important;
        height: 100%;
        position: fixed;
        font-size: 0px;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 1001;
        overflow: hidden;
    }
    .main-container{
        min-height: 100%;
        transition: margin-left .28s;
        margin-left: @sideBarWidth;
        position: relative;
    }
    .fixed-header {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9;
      width: calc(100% - 210px);
      transition: width 0.28s;
    }

    &.hideSidebar {
        .main-container {
            margin-left: 54px;
        }

        .sidebar-container {
            width: 54px !important;
        }

    }
}
.app-container{
    padding: 20px;
    padding-top:104px;
}
</style>
<style lang="less" >
.horizontalSidebar{
    .sidebar-container{
        height: 56px;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
    }
    .fixed-header{
        position: fixed;
        top: 56px;
        left: 0;
        z-index: 9;
        width: 100%;
        .header-bar{
            padding-left: 10px;
        }
        .tags-view-container{
            padding-left: 10px;
        }
    }
    .sidebar-logo-container{
        float: left;
        width: 200px;
        height: 100%;
    }
    .el-scrollbar{
        float: left;
        width: calc(100% - 200px);
    }
    .app-container{
        padding-top:155px;
    }
}
.app-container{
    background-color: #f1f2f5;
}
</style>
