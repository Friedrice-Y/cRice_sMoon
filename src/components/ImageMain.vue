<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top p-3">
            <!-- <div > {{ item.url }}</div> -->
            <el-row :gutter="10">
                <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
                    <el-card shadow="hover" class="relative mb-3" :body-style="{ 'padding': 0 }">
                        <el-image :src="item.url" fit="cover" :preview-src-list="[item.url]" :initial-index="0"
                            class="w-full h-[150px]" style="width:100%"></el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex items-center justify-center p-2">
                            <el-button type="primary" size="small" text @click="handleEdit(item)">重命名</el-button>
                            <el-popconfirm title="是否要删除该图片" confirmButtonText="确认" cancelButtonText="取消"
                                @confirm="handleDelete(item.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-card>

                </el-col>
            </el-row>

        </div>
        <div class="bottom">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getDate" />
        </div>
    </el-main>
    <el-drawer v-model="drawer" title="上传图片">
        <UploadFile :data="{ imageClassId }" @success="handleUploadSuccess" />
    </el-drawer>
</template>
<script setup>
import { ref } from 'vue';
import { getImageList, updateImage, deleteImage } from '~/api/image';
import { showPrompt, toast } from '~/composables/utils';
import UploadFile from './UploadFile.vue';
// 分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);
const list = ref([]);
const loading = ref(false);
const imageClassId = ref(0);

// 上传图片
const drawer = ref(false);

const openUploadFile = () => {
    drawer.value = true
};


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
const handleEdit = (item) => {

    showPrompt("重命名", item.name).then(({ value }) => {
        loading.value = true
        updateImage(item.id, value).then((res) => {
            toast("修改成功");
            getDate();
        }).finally(() => {
            loading.value = false;
        })
    })
}

const handleDelete = (id) => {
    loading.value = true;
    deleteImage([id]).then(res => {
        toast("删除成功")
        getDate()
    }).finally(() => {
        loading.value = false;
    })
}

const handleUploadSuccess = () => getDate(1);
defineExpose({
    loadDate,
    openUploadFile
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

.image-title {
    position: absolute;
    top: 122px;
    left: -1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>