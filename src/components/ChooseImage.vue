<template>
  <div v-if="modelValue" class="w-[100px] h-[100px]">
    <el-image
      :src="modelValue"
      fit="cover"
      class="w-[100px] h-[100px] rounded border mr-2"
    ></el-image>
  </div>
  <div class="choose-image-btn" @click="open">
    <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
  </div>
  <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
    <el-container class="bg-white rounded" style="height: 70vh">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpenCreate"
          >新增图片分类</el-button
        >
        <el-button type="warning" size="small" @click="handleOpenUpload"
          >上传图片</el-button
        >
      </el-header>
      <el-container>
        <ImageAside ref="imageAsideRef" @change="handleAsideChange" />
        <ImageMain openChoose ref="ImageMainRef" @choose="handleChoose" />
      </el-container>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">OK</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import ImageAside from "~/components/ImageAside.vue";
import ImageMain from "~/components/ImageMain.vue";

const dialogVisible = ref(false);

const open = () => (dialogVisible.value = true);

const close = () => (dialogVisible.value = false);

const imageAsideRef = ref(null);

const handleOpenCreate = () => imageAsideRef.value.handleCreate();

const ImageMainRef = ref(null);

const handleAsideChange = (imageClassId) =>
  ImageMainRef.value.loadDate(imageClassId);

const handleOpenUpload = () => ImageMainRef.value.openUploadFile();

// 接收父组件传递过来的数据
const props = defineProps({
  modelValue: [String, Array],
});
// 更新父组件数据的方法
const emit = defineEmits(["update:modelValue"]);

// 接收选中的图片数据
let urls = [];

const handleChoose = (e) => {
  urls = e.map((o) => o.url);
};

const submit = () => {
  if (urls.length) {
    emit("update:modelValue", urls[0]);
  }
  close();
};
</script>
<style>
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer
  cursor-pointer hover:(bg-gray-100);
}

.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}

.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}

.image-main {
  position: relative;
}

.image-aside .top,
.image-main .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-aside .bottom,
.image-main .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  right: 0;
  left: 0;
  @apply flex items-center justify-center;
}
</style>
