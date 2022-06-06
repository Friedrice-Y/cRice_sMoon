<template>
    <el-aside width="220px" class="image-aside" v-loading="loading">
        <div class="top">
            <AsideList v-for="(item, index) in list" :key="index" :active="item.id == activeId">
                {{ item.name }}
            </AsideList>
        </div>
        <div class="bottom">
            分页区域
        </div>
    </el-aside>
</template>
<script setup>
import AsideList from './AsideList.vue';
import { getImageClassList } from '~/api/image_class';
import { ref } from 'vue';

// 加载动画
const loading = ref(false);

const list = ref([]);
const activeId = ref(0);

function getDate() {
    loading.value = true
    getImageClassList(1).then((res) => {
        list.value = res.list;
        let item = list.value[0];
        if (item) {
            activeId.value = item.id;
        }
    }).finally(() => {
        loading.value = false
    })
}
getDate();
</script>
<style>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.image-aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-aside .bottom {
    position: absolute;
    bottom: 0;
    height: 50px;
    right: 0;
    left: 0;
    @apply flex items-center justify-center;
}

.aside-list {
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center p-3 text-sm text-gray-600;
}

.aside-list:hover,
.active {
    @apply bg-blue-50;
}
</style>