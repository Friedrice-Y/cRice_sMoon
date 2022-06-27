<template>
  <div class="flex items-center mb-4 justify-between">
    <div>
      <el-button
        v-if="btns.includes('create')"
        type="primary"
        size="small"
        @click="$emit('create')"
        >新增</el-button
      >

      <el-popconfirm
        title="是否要删除选中记录?"
        confirmButtonText="提交"
        cancelButtonText="取消"
        v-if="btns.includes('delete')"
        @confirm="$emit('delete')"
      >
        <template #reference>
          <el-button type="danger" size="small">批量删除</el-button>
        </template>
      </el-popconfirm>
      <slot />
    </div>

    <el-tooltip
      effect="dark"
      v-if="btns.includes('refresh')"
      content="刷新数据"
      placement="top-start"
    >
      <el-button text @click="$emit('refresh')">
        <el-icon :size="20">
          <Refresh />
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
  layout: {
    type: String,
    default: "create,refresh",
  },
});

const btns = computed(() => props.layout.split(","));

defineEmits(["create", "refresh", "delete"]);
</script>
