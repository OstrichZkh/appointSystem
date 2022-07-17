import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta:{
      reqAuth:true
    },
    children:[
      {
        path:'/Appoint',
        name:'Appoint',
        component:()=>import('@/views/Appoint.vue')
      },
      {
        path:'/Makeappoint',
        name:'Makeappoint',
        component:()=>import('@/views/Makeappoint.vue')
      },
      {
        path:'/Info',
        name:'Info',
        component:()=>import('@/views/Info.vue')
      },
      {
        path:'/Revinfo',
        name:'Revinfo',
        component:()=>import('@/views/Revinfo.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path:'/register',
    name:'register',
    component:RegisterView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next)=>{
  if(localStorage.getItem('token')){
    //验证jwt
    if(to.name=='login'){
      router.push('/home')
    }else{
      next()
    }
  }else{
    if(to.meta.reqAuth!==true){
      next()
    }else{
      router.push('/login')
    }
}
})

export default router
