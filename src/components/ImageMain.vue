<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top">
            <div v-for="(item, index) in list" :key="index"> {{ item.url }}</div>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getDate" />
        </div>
    </el-main>
</template>
<script setup>
import { ref } from 'vue';
import { getImageList } from '~/api/image';
// 分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);
const list = ref([]);
const loading = ref(false);
const imageClassId = ref(0);


function getDate(p = null) {
    if (typeof p === "number") {
        currentPage.value = p;
    }
    loading.value = true;
    getImageList(imageClassId.value, currentPage.value).then((res) => {
        total.value = res.totalCount;
        list.value = res.list;
    }).finally(() => {
        loading.value = false
    })
}

// 根据分类 id 重新加载列表
const loadDate = (id) => {
    currentPage.value = 1;
    imageClassId.value = id;
    getDate(imageClassId);
}

defineExpose({
    loadDate
})

</script>
<style>
.image-main {
    position: relative;
}

.image-main .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-main .bottom {
    position: absolute;
    bottom: 0;
    height: 50px;
    right: 0;
    left: 0;
    @apply flex items-center justify-center;

}
</style>