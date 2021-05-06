<template>
    <div class="setting-drawer">
        <div :class="['setting-icon',drawer?'tra':'']" @click="ShowSetting">
            <svg-icon v-if="!drawer" name="setting" />
            <svg-icon v-else name="close" />
        </div>
        <el-drawer
            title="系统配置"
            :visible.sync="drawer"
            :modal-append-to-body="true"
            :size="300"
        >
            <ul>
                <li>
                    <span>
                        菜单栏类型
                    </span>
                    <!-- <el-switch
                        v-model="siderbarType"
                        @change="changeSidebar"
                    /> -->
                    <el-radio-group v-model="siderbarType" @change="changeSidebar">
                        <el-radio label="vertical">纵向</el-radio>
                        <el-radio label="horizontal">横向</el-radio>
                    </el-radio-group>
                </li>
            </ul>
        </el-drawer>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { setSidebarType } from '@/utils/cookies'
@Component({
    name: 'Setting'
})
export default class Setting extends Vue {
    private drawer: boolean = false
    private siderbarType: string = 'vertical'
    private ShowSetting() {
        this.drawer = !this.drawer
    }
    public changeSidebar(value: string) {
        this.$router.go(0)
        console.log(value)
        setSidebarType(value)
    }
    mounted() {
        this.siderbarType = AppModule.sidebar.mode === undefined ? 'vertical' : AppModule.sidebar.mode
    }
}
</script>
<style lang="less" scoped>
.setting-drawer{
    .setting-icon{
        cursor: pointer;
        position: fixed;
        z-index: 9999;
        right: 0;
        top: 51%;
        background-color: #409eff;
        text-align: center;
        height: 40px;
        width: 40px;
        line-height: 40px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        transition: 0.3s;
        svg{
            font-size: 20px;
            color: #fff;
            font-weight: bold;
            vertical-align: middle;
        }
    }
    .tra{
        right: 300px;
    }
    ul{
        padding: 0 20px;
        li{
            overflow: hidden;
            span{
                color: rgba(0,0,0,.65);
                font-size: 14px;
                padding: 12px 0;
            }
            .el-switch,.el-radio-group{
                float: right;
            }
        }
    }
}
</style>
