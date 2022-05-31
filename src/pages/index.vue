<template>
  <div>后台首页</div>
  {{ $store.state.user.username }}
  <el-button @click="handleLogout">退出登录</el-button>
</template>
<script setup>
import { showModal, toast } from "~/composables/utils";
import { logOut } from '~/api/manager';
import { useRouter } from 'vue-router';
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

function handleLogout() {
  showModal('是否要确认退出登录？').then((res) => {
    logOut().finally(() => {
      store.dispatch('logOut');

      router.replace('/login')
      toast('退出登录成功')
    });
  });
}
</script>
