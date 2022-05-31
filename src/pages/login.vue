<template>
    <el-row class="login-container">
        <el-col :lg="16" :md="12" class="left">
            <div>
                <div>欢迎光临</div>
            </div>
        </el-col>
        <el-col :lg="8" :md="12" class="right">
            <h2 class="title">欢迎回来</h2>
            <div>
                <span class="line"></span>
                <span>账号密码登录</span>
                <span class="line"></span>
            </div>
            <el-form ref="formRef" :rules="rules" :model="form">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <user />
                            </el-icon>
                        </template>
                    </el-input>

                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password>
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="w-[250px]" round color="#626aef" type="primary" @click="onSubmit"
                        :loading="loading">登录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>
<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from "~/composables/utils";
import { useStore } from 'vuex';

const store = useStore();

const router = useRouter();




const form = reactive({
    username: '',
    password: ''
})

const rules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 3, max: 5, message: '用户长度必须是3-5个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 3, max: 5, message: '用户长度必须是3-5个字符', trigger: 'blur' }
    ]
}
const formRef = ref(null);
const loading = ref(false)
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            return false
        };
        loading.value = true;
        store.dispatch("login", form).then(res => {
            toast('登录成功')
            router.replace('/');
        }).finally(() => {
            loading.value = false;
        });
    })
}

function onKeyUp(e) {
    if (e.key == "Enter") onSubmit()
}
// 添加键盘监听事件
onMounted(() => {
    document.addEventListener("keyup", onKeyUp)
});
onBeforeUnmount(() => {
    document.removeEventListener("keyup", onKeyUp)
});


</script>
<style scoped>
.login-container {
    @apply min-h-screen bg-indigo-500;
}

.login-container .left,
.login-container .right {
    @apply flex items-center justify-center;
}

.login-container .right {
    @apply bg-light-50 flex-col;
}

.left>div>div:first-child {
    @apply font-bold text-5xl text-light-50 mb-4;
}

.right .title {
    @apply font-bold text-3xl text-gray-800;
}

.right>div {
    @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}

.right .line {
    @apply h-[1px] w-16 bg-gray-200;
}
</style>
