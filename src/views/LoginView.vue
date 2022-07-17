<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">预约管理系统</div>

            <el-form :model="param" :rules="rules" ref="formRef" label-width="0px" class="ms-content">
                <!-- 账号 -->
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="请输入注册手机/邮箱">
                        <template #prepend>
                            <el-icon><UserFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                        <el-input type="password" placeholder="请输入密码" v-model="param.password"
                            @keyup.enter="login(formRef)">
                            <template #prepend>
                                <el-icon><Lock /></el-icon>
                            </template>
                        </el-input>
                </el-form-item>
                <!-- 登录注册 -->
                <el-form-item>
                    <div class="login-btn"><el-button type="primary" @click="login(formRef)">登录</el-button></div>
                    <div class="login-btn"><el-button type="default" @click="register()">注册新账号</el-button></div>
                </el-form-item>
                </el-form>

                <!-- 登录按钮 -->
                <!-- <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div> -->
                <!-- 注册按钮 -->
                <!-- <div class="login-btn">
                    <el-button type="default" @click="register()">注册新账号</el-button>
                </div> -->
                <p class="login-tips">Tips : 我是一条tips~~~</p>


        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import axios from 'axios';

export default {
    setup() {
        const router = useRouter()
        const param = reactive({
            username: "",
            password: "",
        });
        let formRef = ref()
        const rules = {
            username: [
                {
                    required: true,
                    message: "请输入注册手机号/邮箱",
                    trigger: "blur",
                }
            ],
            password: [
                { required: true, message: "请输入密码", trigger: "blur" },
                { min: 5, max: 15, message: '密码位数在5-15位之间', trigger: 'blur' }
            ],
        };
        // 登录
        const login = ()=>{
            axios({
                method:'POST',
                url:'http://localhost:3002/login/validate',
                data:{
                  'account':param.username,                  
                  'password':param.password
                }
            }).then(res=>{
                if(res.data.code==200){
                    localStorage.removeItem('info')
                    localStorage.setItem('info',JSON.stringify(res.data.data))
                    localStorage.setItem('token',res.data.token)
                    router.push({
                        name:'home',
                        params:res.data.data
                    })
                }else{
                    alert('账号或者密码错误')
                }
            })
        }
        // 注册
        const register = ()=>{
            router.push('/register')
        };
        return {
            rules,
            param,
            register,
            formRef,
            login
        };
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    /* background-image: url(../assets/img/login-bg.jpg); */
    background-image: url(../assets/img/BNU.webp);

    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px 0 30px;
}
.login-btn {
    width: 40%;
    margin: 0 auto;
    text-align: center;
    display: inline-block;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: -10px;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>