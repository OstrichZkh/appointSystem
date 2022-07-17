<template>
<div class="sidebar">
    <el-menu class="sidebar-el-menu"  :collapse="this.$store.state.barCollapse" background-color="#324157"
              text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened>
        <el-menu-item index="1">
            <el-icon><DataBoard /></el-icon>
             <router-link :to="items[0].path" class="tags-li-title">{{items[0].title}}</router-link>
        </el-menu-item>
        
        <el-menu-item index="2">
            <el-icon><DeleteLocation /></el-icon>
            <router-link :to="items[1].path" class="tags-li-title">{{items[1].title}}</router-link>
        </el-menu-item>

        <!-- <el-menu-item index="3">
            <el-icon><DeleteLocation /></el-icon>
            <router-link :to="items[2].path" class="tags-li-title">{{items[2].title}}</router-link>
        </el-menu-item> -->

        <el-menu-item index="4">
            <el-icon><DeleteLocation /></el-icon>
            <router-link :to="items[3].path" class="tags-li-title">{{items[3].title}}</router-link>
        </el-menu-item>



  </el-menu>
</div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent ({
  name:'',
  components:{},
  props:{},
  setup(props, ctx){
    const items = [
            {
                index: "/appoint",
                title: "我的预约",
                path:"Appoint"
            },
            {
                index: "/makeappoint",
                title: "活动预约",
                path:"Makeappoint"
            },
            {
                index: "/info",
                title: "个人中心",
                path:"Info"
            },
            {
                index: "/revinfo",
                title: "信息修改",
                path:"Revinfo"
            }
            ]
    return {
      items
    }
  },
})
</script>

<style scoped>
*{
  color: white;
}
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>