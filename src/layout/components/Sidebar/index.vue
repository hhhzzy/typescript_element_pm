<template>
    <div>
        <sidebar-logo :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                background-color="#304156"
                text-color="#bfcbd9"
                active-text-color="#409EFF"
                :unique-opened="false"
                :collapse-transition="false"
                :mode="mode"
            >
                <sidebar-item
                    v-for="(item,index) in routes"
                    :key="index"
                    :is-collapse="isCollapse"
                    :route="item"
                    :base-path="item.path"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SidebarItem from './SidebarItem.vue'
import SidebarLogo from './SidebarLogo.vue'
import { PermissionModule } from '@/store/modules/permission'
import { AppModule } from '@/store/modules/app'
@Component({
    name: 'Siderbar',
    components: {
        SidebarLogo,
        SidebarItem
    }
})

export default class Siderbar extends Vue {
    @Prop({ required: true }) mode!: string
    @Watch('mode')
    modeChange(newVale: string) {
        console.log(newVale)
    }
    get isCollapse() {
        return !AppModule.sidebar.opened
    }
    get routes() {
        return PermissionModule.routes
    }
    get activeMenu() {
        const route = this.$route
        const { meta, path } = route
        if (meta.activeMenu) {
            return meta.activeMenu
        }
        return path
    }
    mounted() {
    }
}
</script>
<style lang="less">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>
<style lang="less" scoped>
.el-scrollbar {
  height: 100%
}

.has-logo {
  .el-scrollbar {
    height: calc(100% - 50px);
  }
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
