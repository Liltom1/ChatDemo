import { createRouter, createWebHashHistory  } from 'vue-router';
import Chat from '@/views/Chat.vue';
import login from '@/views/Login.vue';
import welcome from '@/views/Welcome.vue';

const routes = [
  { path: '/', name: 'welcome', component: welcome },
  { path: '/login', name: 'login', component: login },
  { path: '/Chat', name: 'Chat', component: Chat }
];

const router = createRouter({
  history: createWebHashHistory (),
  routes:routes
});

router.beforeEach((to,from,next)=>{
  if(!sessionStorage.getItem("token") && to.path !== "/login"){
      alert("请先登录!")
      next({ path: '/login' })
    }else{
      next()
      console.log(to.path)
    }
})

console.log(router.getRoutes())

export default router ;
