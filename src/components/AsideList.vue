<template>
    <div class="aside-list" :class="{ 'active': active }">
        <span class="truncate">
            <slot></slot>
        </span>
        <el-button class="ml-auto px-1" text type="primary" size="small" @click="$emit('edit')">
            <el-icon>
                <Edit :size="12" />
            </el-icon>
        </el-button>
        <el-popconfirm title="是否要删除该分类?" confirmButtonText="提交" cancelButtonText="取消" @confirm="$emit('delete')">
            <template #reference>
                <el-button text class="px-1" type="primary" size="small">
                    <el-icon>
                        <Close :size="12" />
                    </el-icon>
                </el-button>
            </template>
        </el-popconfirm>
    </div>
</template>
<script setup>
defineProps({
    active: {
        type: Boolean,
        default: false
    }
});
defineEmits(['edit', 'delete'])
</script>
<style>
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