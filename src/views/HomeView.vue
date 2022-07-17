<template>
  <Header></Header>
  <SideBar></SideBar>

  <div class="content-box" >
    <router-view></router-view>
  </div>

</template>

<script>
import Header from '@/components/Header.vue'
import SideBar from '@/components/SideBar.vue'
import Calendar from '@/components/Calendar.vue'
import { useRouter,createRouter, createWebHistory } from "vue-router";
import {onMounted, ref,onBeforeMount} from 'vue'


export default {
  name: 'HomeView',
  components: {
    Header,
    SideBar,
    Calendar
  },

  setup(){
    let router = useRouter()
    onBeforeMount(
      ()=>{
        let params = router.currentRoute._value.params
        console.log(params)
      }
    );
    

    return {
      
    }

  }
}
</script>

<style>
.siderbar{
  display: flex;
}
.content-box{
  float: right;
}

</style>
