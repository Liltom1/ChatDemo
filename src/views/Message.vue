<template>
    <div :style="`float:` + `${ message.from.id === userInfo.id ? 'right;' : 'left;' }`">
        <template v-if="message.type === 'text'">
            <div v-if="message.from.id === userInfo.id" class="massage-box">
                <span> {{ message.message  + ':说'}}</span>
                <el-avatar> {{  message.from.name }} </el-avatar> 
            </div>
            <div v-else class="massage-box">
                <el-avatar> {{  message.from.name }} </el-avatar> 
                <span> {{ '说：' + message.message }}</span>
            </div>
        </template>
        <template v-if="message.type === 'img'"  >
            <div v-if="message.from.id === userInfo.id" class="massage-box">
                <el-image style="width: 100px; height: 100px" :src="'http://localhost:3000' + message.message" lazy />
                <el-avatar class="avatar">{{ ':' + message.from.name  }}</el-avatar> 
            </div>
            <div v-else class="massage-box">
                <el-avatar class="avatar">{{ message.from.name + ':'}}</el-avatar> <el-image style="width: 100px; height: 100px" :src="'http://localhost:3000' + message.message" lazy />
            </div>
        </template>
    </div>

</template>

<script setup >
import { ref, reactive , defineProps ,onMounted } from 'vue'

defineProps({
   message:{
       default:{},
       type:Object
   },
})

let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
onMounted(() => {
  
})

</script>
<style scoped>
.massage-box{
    margin-bottom: 10px;
}
.avatar{
    display: inline-block;
    margin-bottom: 50px;
}
:deep(.el-avatar){
    line-height: 40px;
}
.img-box{
    width: 100px;
    height: 100px;
}
</style>