<template>
    <div class="login">
        <div class="login-con">
            <el-card icon="log-in" title="" :bordered="false">
                <div slot="header" class="clearfix">
                    <span>欢迎登录</span>
                </div>
                <div class="form-con">
                    <el-form ref="ruleForm" :model="form" :rules="rules" class="demo-ruleForm" @keydown.enter.native="handleSubmit('ruleForm')">
                        <el-form-item prop="userName">
                            <el-input v-model="form.userName" placeholder="请输入用户名" />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="form.password" type="password" placeholder="请输入密码" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSubmit('ruleForm')">登录</el-button>
                        </el-form-item>
                    </el-form>
                    <p class="login-tip">输入用户名和密码</p>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script lang="ts">
import { ElForm } from 'node_modules/element-ui/types/form'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { ILoginData } from '@/api/types'
import { UserModule } from '@/store/modules/user'
import { Dictionary } from 'vue-router/types/router'
import { Route } from 'vue-router'

@Component({
    name: 'Login'
})

export default class Login extends Vue {
    private form: ILoginData = {
        userName: '',
        password: ''
    }
    private rules: object = {
        userName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
        ]
    }
    private redirect?: string
    private otherQuery: Dictionary<string> = {}
    @Watch('$route', { immediate: true })
    private onRouteChange(route: Route) {
        console.log(route)
        const query = route.query as Dictionary<string>
        if (query) {
            this.redirect = query.redirect
            this.otherQuery = query
        }
    }
    handleSubmit(formName: string) {
        (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
            if (valid) {
                console.log(this.form)
                await UserModule.Login(this.form)
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            } else {
                console.log('error submit!!')
                return false
            }
        })
    }
}
</script>
<style lang="less" scoped>
.login{
    width: 100%;
    height: 100%;
    background-image: url('../../assets/login-bg.png');
    background-size: cover;
    background-position: center;
    &-con{
        position: absolute;
        right: 160px;
        top: 50%;
        left: 50%;
        margin-left: -150px;
        transform: translateY(-60%);
        width: 300px;
        &-header{
            font-size: 16px;
            font-weight: 300;
            text-align: center;
            padding: 30px 0;
        }
        .form-con{
            padding: 10px 0 0;
        }
        .login-tip{
            font-size: 10px;
            text-align: center;
            color: #c3c3c3;
        }
    }
    button{
        width: 100%;
    }
}
</style>
