<template>
    <div class="right-menu-box">
        <div class="menu-list">
            <!-- <svg-icon class="setting-icon" name="setting" @click="showSetting" /> -->
        </div>
        <el-dropdown trigger="click" size="small">
            <div>
                <div class="mine-img">
                    <svg-icon name="user" />
                </div>
                <span class="name-sp">黄照阳</span>
                <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item> -->
                <el-dropdown-item divided @click.native="lagout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import Setting from '@/layout/components/Setting/index.vue'
@Component({
    name: 'Mine',
    components: {
        Setting
    }
})
export default class Mine extends Vue {
    // 退出登录
    private async lagout() {
        await UserModule.Layout()
        this.$router.push({
            path: `/login?redirect=${this.$route.path}` // 退出后重新登录回到当前页面
        })
    }
    // 展示setting页面
    public showSetting() {
    }
}
</script>
<style lang="less" scoped>
.right-menu-box{
    float: right;
    margin-right: 40px;
        height: 100%;
    .mine-img{
        cursor: pointer;
        height: 35px;
        width: 35px;
        text-align: center;
        line-height: 40px;
        background-color:rgb(64, 158, 255);
        margin-top: 5px;
        border-radius: 50%;
        float: left;
        svg{
            color: #fff;
            font-size: 20px;
            margin-top: 10px;
        }
    }
    .name-sp{
        float: left;
        display: block;
        height: 100%;
        line-height: 45px;
        padding-right: 0;
        padding-left: 5px;
        cursor: pointer;
    }
    .el-icon-caret-bottom{
        position: absolute;
        bottom: 0;
        right: -15px;
        top: 15px;
    }
    .menu-list{
        padding: 0 10px;
        display: inline-block;
        height: 100%;
        vertical-align: text-bottom;
        line-height: 50px;
        transition: 0.3s;
        margin-right: 10px;
        .setting-icon{
            font-size: 20px;
            vertical-align: middle;
            color: #5a5e66;
            cursor: pointer;
        }
        &:hover {
            background-color: #fcf9f9;
        }
    }
}
</style>
