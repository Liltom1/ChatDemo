<template>
    <div class="login-container">
        <el-form ref="loginForm"  class="login-form">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="username" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="password" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleLogin">登录</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { ref,reactive} from 'vue'
import { useRouter } from 'vue-router';


export default {
    setup() {
        let username = ref('');
        let password = ref('');
        
        const router = useRouter();
        const handleLogin = () => {
            fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: username.value,
                    password: password.value
                })
            }).then(res => {
                return res.json()
            }).then(res => {
                console.log(res, 'res')
                if (res.code === 200) {
                    sessionStorage.setItem('token', res.token)
                    sessionStorage.setItem('userInfo', JSON.stringify(res.userInfo))
                    router.push({
                        name: 'Chat'
                    });
                } else {
                    alert(res.message)
                }
            })
        };

        const handleReset = () => {
                username.value = ''
                password.value = ''
        };

        return {
            username,
            password,
            handleLogin,
            handleReset
        };
    }
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 99vh;
    background-color: #f0f2f5;
    /* 示例背景色 */
}

.login-form {
    width: 300px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background-color: #fff;
}
</style>