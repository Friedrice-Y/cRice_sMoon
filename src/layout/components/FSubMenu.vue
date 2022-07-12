<template>
  <template v-for="(subMenu, index) in child">
    <el-sub-menu
      v-if="subMenu.child && subMenu.child.length > 0"
      :index="index + ''"
    >
      <template #title>
        <el-icon v-if="subMenu.icon">
          <component :is="subMenu.icon"></component>
        </el-icon>
        <span>{{ subMenu.name }}</span>
      </template>
      <template #default>
        <f-sub-menu :child="subMenu.child"></f-sub-menu>
      </template>
    </el-sub-menu>
    <el-menu-item v-else :index="subMenu.frontpath">
      <el-icon v-if="subMenu.icon">
        <component :is="subMenu.icon"></component>
      </el-icon>
      <span>{{ subMenu.name }}</span>
    </el-menu-item>
  </template>
</template>

<script>
export default {
  name: "FSubMenu",
};
</script>

<script setup>
const props = defineProps({
  child: {
    type: Array,
    default: () => [],
  },
});
</script>
