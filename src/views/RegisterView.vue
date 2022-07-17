<template>
  <Header></Header>
  <div class="page">
    <div class="form">
    <el-form
        ref="ruleFormRef"
        :model="registerForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        size="large"
        status-icon
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="registerForm.name" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <div class="phone">
            <el-input v-model="registerForm.phone" />
            <el-button :disabled="isCodeSend" @click="validateCodeSend" class="button" :value="123123">
              <span class="codeSpan" v-if="!isCodeSend">发送验证码</span>
              <span class="codeSpan" v-else>请{{ countDown }}秒后再发</span>
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="验证码" prop="validateCode">
          <el-input v-model="registerForm.validateCode" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="请再次输入密码" prop="password2">
          <el-input
            v-model="registerForm.password2"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="registerForm.gender" placeholder="请选择">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
        </el-form-item>
        <el-form-item label="身份" prop="type">
          <el-radio-group v-model="registerForm.type">
            <el-radio label="老师" />
            <el-radio label="学生" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="mail" prop="mail">
          <el-input v-model="registerForm.mail" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
  </div>
  
  
</template>

<script>
import Header from '@/components/Header.vue'
import { FormInstance, FormRules } from 'element-plus'
import {reactive,ref,getCurrentInstance,onMounted, nextTick} from 'vue'
import {useStore} from 'vuex'
import axios from 'axios'
import { useRouter } from 'vue-router'
export default {
  name: 'RegisterView',
  components: {
    Header
  },
  setup(){
    const router = useRouter()
    const store = useStore()
    const formSize = ref('default')
    const ruleFormRef = ref()
    const registerForm = reactive({
      name: '',
      phone:'',
      validateCode: '',
      password:'',
      password2:'',
      gender:'',
      type:'',
      mail:''

    })
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (registerForm.password2 !== '') {
          if (!ruleFormRef.value) return
          ruleFormRef.value.validateField('password2', () => null)
        }

        callback()
      }
    }

    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== registerForm.password) {
        callback(new Error("密码不匹配"))
      } else {
        callback()
      }
    }
    const rules = reactive({
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '请输入正确姓名', trigger: 'blur' },
        ],
        phone:[
          { required: true, message: '请输入电话', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位电话号码', trigger: 'blur' },
        ],
        validateCode:[
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '请输入4位验证码', trigger: 'blur' },
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
          { min: 5, max: 15, message: '密码位数在5-15位之间', trigger: 'blur' },
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        password2: [
          { validator: validatePass2, trigger: 'blur' },
          { required: true, message: '请再次输入密码', trigger: 'blur' }
        ],
        gender:[
          {
            required: true,
            message: '请选择性别',
            trigger: 'change',
          },
        ],
        type:[
          {
            required: true,
            message: '请选择身份',
            trigger: 'change',
          },
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 5, max: 30, message: '请输入正确邮箱', trigger: 'blur' },
        ],

    })
    let countDown = ref(0)
    let isCodeSend = ref(false)

    const validateCodeSend = ()=>{
      // 发送验证码
      if(registerForm.phone.length==11){
          axios({
          method:'GET',
          url:'http://localhost:3002/login/codeFake',
          params:{
            phone:registerForm.phone
          }
        }).then((res=>{
          console.log(res)
        }))
        // 开始倒计时
        countDown.value = 60
        isCodeSend.value = true
        let timer = setInterval(()=>{
          countDown.value--
          if(countDown.value==0){
            clearInterval(timer)
          }
        },1000)
      }else{
        return false
      }
      
    }

    // 创建账号
    const submitForm = (formEl)=>{
      if (!formEl) return
        formEl.validate((valid) => {
          if (valid) {
              axios({
                method:'POST',
                url:'http://localhost:3002/login/register',
                data:{
                  'name':registerForm.name,
                  'phone':registerForm.phone,
                  'code':registerForm.validateCode,
                  'password':registerForm.password,
                  'gender':registerForm.gender,
                  'type':registerForm.type,
                  'mail':registerForm.mail,
                }
              }).then((res=>{
                router.push('/login')
              }))
          } else {
            console.log('error submit!')
            // return false
          }
      })



    }

    const resetForm = (form)=>{
      if (!form) return
      form.resetFields()
    }
    
    return{
      registerForm,
      rules,
      formSize,
      ruleFormRef,
      store,
      validateCodeSend,
      isCodeSend,
      countDown,
      submitForm,
      resetForm
    }
  }
}
</script>
<style scoped>
.page{
  background-image: url(../assets/img/bg2.webp);
  background-size: 100%;
  height: 100%;
  width: 100%;
}
.form{
  /* margin-top: 30px; */
  padding-top: 30px;
  margin: 0 auto;
  width: 30%;

}
.phone{
  display: flex;
}
.button{
  margin-left: 20px ;
  width: 200px;
}

</style>
