<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="250px">
        房间列表：
        <el-row>
          <el-col :span="24" v-for="(item, index) in rooms" :key="item" class="roomlist">
            <el-check-tag :checked="checked[index]" @change="onChange(item)"> 房间名：{{ item.name }}</el-check-tag>
          </el-col>
        </el-row>
        <div class="roomlistOptions">
          <el-button @click="showNewRoom">新建房间</el-button> <el-button @click="showAddRoom">加入新房间</el-button>
        </div>
      </el-aside>
      <el-divider direction="vertical" />
      <div class="common-layout-right">
        <el-container>
          <el-header>
            <el-row justify="space-between">
              <el-col :span="8"> <el-space wrap=""><span>当前登录用户：{{ userInfo.name }}</span> <span>当前房间：{{ currentRoomName
                    }}</span></el-space> </el-col>
              <!-- <el-col :span="12"></el-col> -->
              <el-col :span="2">
                <el-button type="primary" @click="logout">退出</el-button>

              </el-col>
            </el-row>
          </el-header>
          <el-divider />
          <el-main>
            <el-row>
              <el-col :span="24" v-for="(item, index) in chatList" :key="item">
                <MassageItem :message="item" />
                <!-- {{ item }} -->
              </el-col>
            </el-row>
          </el-main>
          <el-divider />
          <el-footer>
            <el-row>
              <el-col :span="24">
                <el-upload ref="upload" class="avatar-uploader" :auto-upload="false" action="#"
                  :on-change="handleChange" :on-success="handleAvatarSuccess" :file-list="fileList"
                  :before-upload="beforeAvatarUpload" :http-request="uploadImg">
                  <template #trigger>
                    上传图片
                    <el-icon class="avatar-uploader-icon">
                      <Plus />
                    </el-icon>
                  </template>
                </el-upload>
                <el-input placeholder="请输入内容" type="textarea" :autosize="{ minRows: 4 }"
                  v-model="messageText"></el-input>
                <el-button class="sendButton" type="primary" @click="sendMessage">发送</el-button>
              </el-col>
            </el-row>
          </el-footer>
        </el-container>
      </div>


    </el-container>
    <el-dialog v-model="newRoomVisible" title="新建房间" width="500" :before-close="handleClose" :modal="false">
      <el-form :model="roomInfo">
        <el-form-item label="房间名" prop="name">
          <el-input v-model="roomInfo.name" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="newRoomVisible = false">取消</el-button>
          <el-button type="primary" @click="newRoom">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="addRoomVisible" title="加入新房间" width="500" :before-close="handleClose" :modal="false">
      <el-form :model="roomInfo">
        <el-form-item label="房间名" prop="name">
          <el-input v-model="roomInfo.name" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addRoomVisible = false">取消</el-button>
          <el-button type="primary" @click="addRoom">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>


<script setup name='Chat'>
import { io } from 'socket.io-client';
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import MassageItem from './Message.vue'
// console.log(sessionStorage.getItem('userInfo'), 'token');
import { useRouter } from 'vue-router';
const router = useRouter();

let rooms = ref([]);

let checked = ref([])
const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

let socket = io('ws://localhost:3000',{
  extraHeaders: {
    'Authorization': sessionStorage.getItem('token'),
  }
});

onMounted(() => {
  socket.emit('search', { userId: userInfo.id });//查询用户的房间
})

const newRoomVisible = ref(false);
const addRoomVisible = ref(false);
const roomInfo = reactive({
  name: '',
})


let chatList = reactive([]);

socket.on('connect', () => {
  console.log('连接成功');
  socket.on('reject', (isAccept)=>{
    console.log(isAccept, 'isAccept');
    
    if(!isAccept){
      ElMessage({
        message: '请重新登录！',
        type: 'warning',
      })
      router.push({
        name: 'login'
      });
    }
  });//查询用户的房间

  //接收服务器的消息
  socket.on('receiveMessage', (message) => {
    console.log(message, 'message');
    if (message.roomId === currentId.value) {
      chatList.push(message);
    }
  })

  //接收服务器的文件传输失败消息
  socket.on('fileErrMessage', (message) => {
    console.log(message.from, 'message');
    // chatList.push(message);
  })

  //接收查询到的当前房间消息
  socket.on('receiveCurrentRoomMessage', (message) => {
    console.log(message, 'receiveCurrentRoomMessage');
    chatList.push(...message);
    // chatList.push(message);
  })

  //接收查询到的当前房间消息
  socket.on('receiveRoom', (room) => {
    rooms.value = room;
    for (let i = 0; i < rooms.value.length; i++) {
      checked.value.push(false);
      socket.emit('join', { roomId: rooms.value[i].id, userName: userInfo.name });//加入一个房间
    }
  })

  //新建房间成功
  socket.on('newRoomSuccess', () => {
    newRoomVisible.value = false;
    alert('新建房间成功');
    socket.emit('search', { userId: userInfo.id });//查询用户的房间
    // socket.emit('join', { roomId: rooms.value[i].id, userName: userInfo.name });//加入一个房间
  })

  //加入房间成功
  socket.on('addRoomSuccess', () => {
    addRoomVisible.value = false;
    socket.emit('search', { userId: userInfo.id });//查询用户的房间
  })
})


let currentId = ref('');
let currentRoomName = ref('');
const goChat = (item) => {
  currentRoomName.value = item.name;
  chatList.length = 0;
  currentId.value = item.id;
  console.log(item.id, 'item.id');
  //查询当前房间消息
  socket.emit('searchCurrentRoomMessage', { roomId: item.id })
}


let messageText = ref('');

const sendMessage = () => {
  console.log(currentId.value, 'currentId.value');
  if (currentId.value === '') {
    ElMessage({
      message: '请选择一个房间',
      type: 'warning',
    })
    return;
  }
  const data = {
    roomId: currentId.value,
    message: messageText.value,
    from: {
      id: userInfo.id,
      name: userInfo.name
    },
    type: 'text',
    time: new Date().getTime()
  }
  chatList.push(data);
  //向服务器发送消息
  socket.emit('sendMessage', data);
  messageText.value = '';
}

let fileList = ref([]);

const upload = ref()

const handleChange = (file, fileList) => {
  console.log(file, fileList);
  upload.value.submit();
}

//上传图片之前
const beforeAvatarUpload = (rawFile) => {
  console.log(rawFile, 'beforeAvatarUpload');
  return true
}

const handleAvatarSuccess = (res, file) => {
  console.log(res, file, 'handleAvatarSuccess');
}

//上传图片方法（发消息）
const uploadImg = (file) => {
  console.log(file.file, 'uploadImg');
  if (currentId.value === '') {
    ElMessage({
      message: '请选择一个房间',
      type: 'warning',
    })
    return;
  }
  const data = {
    roomId: currentId.value,
    message: `/images/`+new Date().getTime() + '_' + file.file.name,
    from: {
      id: userInfo.id,
      name: userInfo.name
    },
    time: new Date().getTime(),
    file: file.file,
    type: 'img',
    fileName: new Date().getTime() + '_' + file.file.name
  }
  //向服务器发送消息
  socket.emit('sendImgMessage', data);
  setTimeout(() => {
    chatList.push(data);
  }, 1000);
  // console.log(file);
}

const showNewRoom = () => {
  newRoomVisible.value = true;
}

const newRoom = () => {
  // console.log('新建房间');
  for (let i = 0; i < rooms.value.length; i++) {
    if (rooms.value[i].name === roomInfo.name) {
      ElMessage({
        message: '房间名已存在',
        type: 'warning',
      })
      return;
    }
  }
  socket.emit('newRoom', { user: userInfo, roomName: roomInfo.name });
  handleClose();
}

const handleClose = () => {
  roomInfo.name = '';
  newRoomVisible.value = false;
  addRoomVisible.value = false;
}

const addRoom = () => {
  for (let i = 0; i < rooms.value.length; i++) {
    if (rooms.value[i].name === roomInfo.name) {
      ElMessage({
        message: '你已加入过该房间',
        type: 'warning',
      })
      return;
    }
  }
  socket.emit('addRoom', { user: userInfo, roomName: roomInfo.name });
}

const showAddRoom = () => {
  addRoomVisible.value = true;
}


const logout = () => {
  sessionStorage.removeItem('userInfo')
  sessionStorage.removeItem('token')
  router.push({
    name: 'login'
  });
};

const onChange = (item) => {
  console.log(item);
  for (let i = 0; i < rooms.value.length; i++) {
    if (rooms.value[i].id === item.id) {
      checked.value[i] = true;
    } else {
      checked.value[i] = false;
    }
  }
  goChat(item);
}

</script>
<style scoped lang="less">
.common-layout {
  // height: 100vh;

  .roomlistOptions {
    margin-top: 20px;
  }
  .common-layout-right{
    width: 100%;
    // height: 100vh;
  }
  .sendButton {
    margin-top: 15px;
  }
}

.roomlist {
  cursor: pointer;
  margin: 10px 0px;
  height: 50px;
  line-height: 50px;
}

.avatar-uploader {
  width: 90px;
  height: 25px;
  display: block;
  border: 1px dashed #d9d9d9;
  margin-bottom: 10px;

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 25px;
    height: 25px;
    text-align: center;
  }
}


:deep(.el-aside) {
  width: 235px;
  height: 100%;
  margin-right: 15px;
}

:deep(.el-header) {
  padding-top: 20px;
}

:deep(.el-main) {
  flex: none;
  height: 800px;
  overflow-y: auto;
  margin-bottom: 20px;
}

:deep(.el-footer) {
  height: 150px;
}

:deep(.el-container) {
  height: 100%;
}

:deep(.el-check-tag) {
  display: inline-block;
  width: 185px;
  height: 100%;
  line-height: 45px;
}

:deep(.el-divider--horizontal) {
  margin: 10px 0px;
}

:deep(.el-divider--vertical) {
  height: 99vh;
}
</style>