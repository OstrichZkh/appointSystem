<template>
  <div class="header" >
    <div class="collapse-btn" @click="collapseChage" style="font-size:20px">
        <el-icon><Operation /></el-icon>
    </div>
    <div class="logo">后台管理系统</div>
    <div v-if="userInfo">
      <div class="user">
        <span>{{userInfo.name}},欢迎您</span>
        <img src="@/assets/avator.webp">
        <div class="logout" @click="logout">登出</div>
      </div>
    </div>
    
  </div>
  
   
  


</template>

<script>
import {useRouter} from 'vue-router'
import { defineComponent, reactive} from 'vue'
// import store from '@/store/index.js'
export default defineComponent ({
  name:'',
  components:{},
  props:{},
  setup(props, ctx){
    let userInfo = reactive()
    let router = useRouter()
    userInfo = JSON.parse(localStorage.getItem('info'))
    console.log(userInfo)
    const collapseChage = function(){
      // console.log(this.$store)
      this.$store.commit('changeCollapse')
    }
    const logout = ()=>{
      localStorage.removeItem('token')
      localStorage.removeItem('info')
      router.push('/login')
    }



    return {
      collapseChage,
      userInfo,
      logout
    }
  },
})
</script>

<style scoped>
*{
  color:white;
}

.header {
  background-color: #242f42;

    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.header .logo {
    text-align: left;
    float: left;
    width: 250px;
    line-height: 70px;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}

.header-right {
    float: right;
    padding-right: 50px;
}
.user span {
  line-height: 70px;
  position: absolute;
  right: 160px;
  font-size: 20px;
}
.user .logout{
  position: absolute;
  right: 20px;
  line-height: 70px;
  font-size: 20px;
}

.user .logout:hover{
  color: pink;
  cursor: pointer;
}
.user img {
  position: absolute;
  width: 50px;
  height: 50px;
  right: 80px;
  top: 10px;
  border-radius: 50%;

}

</style>