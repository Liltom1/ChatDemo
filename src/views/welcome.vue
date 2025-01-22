<template>

    <div>
       欢迎进入聊天demo
      <button @click="goChat">点击进入</button>
    </div>
   
   </template>
   
   <script setup lang='ts' name='Chat'>
   import { ref,reactive} from 'vue'
   import { useRouter } from 'vue-router';
    const router = useRouter();
   const goChat = () => {
       router.push({
           name: 'Chat'
       });
   }
   </script>
<style scoped>
   
</style>