<template>
  <el-card shadow="never" class="boder-0">
    <!-- 新增|刷新 -->
    <ListHeader @create="handleCreate" @refresh="getData" />
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="角色名称" width="180" />
      <el-table-column prop="desc" label="角色描述" width="380" />
      <el-table-column label="状态" width="180" align="center">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange($event, row)"
            :loading="row.statusLoading"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" text @click="handleEdit(row)"
            >修改</el-button
          >
          <el-button type="primary" size="small" text @click="openSetRule(row)"
            >配置权限</el-button
          >
          <el-popconfirm
            title="是否要删除该公告?"
            confirmButtonText="提交"
            cancelButtonText="取消"
            @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button text type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex items-center justify-center mt-5">
      <el-pagination
        background
        layout="prev,pager,next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-card>
  <FormDrawer ref="formDrawerRef" title="新增" @submit="handleSubmit">
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="80px"
      :inline="false"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="desc">
        <el-input
          v-model="form.desc"
          placeholder="角色描述"
          type="textarea"
          :rows="5"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色状态" prop="status">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>
  </FormDrawer>

  <!-- 权限配置 -->
  <FormDrawer
    ref="setRuleformDrawerRef"
    title="权限配置"
    @submit="handleSetRuleSubmit"
  >
    <el-tree
      ref="elTreeRef"
      :check-strictly="checkStrictly"
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
      :data="ruleList"
      :props="{ label: 'name', children: 'child' }"
      show-checkbox
      :height="treeHeight"
      @check="handleCheck"
    >
      <template #default="{ node, data }">
        <div class="flex items-center">
          <el-tag size="small" :type="data.menu ? '' : 'info'">{{
            data.menu ? "菜单" : "权限"
          }}</el-tag>
          <span class="ml-2 text-sm">{{ data.name }}</span>
        </div>
      </template>
    </el-tree>
  </FormDrawer>
</template>
<script setup>
import { reactive, ref } from "vue";
import {
  getRoleList,
  createRole,
  deleteRole,
  updateRole,
  updateRoleStatus,
  setRoleRules,
} from "~/api/role.js";
import { getRuleList } from "~/api/rule";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import { toast } from "~/composables/utils";
/**
 * 公告代码抽离封装
 * 组合式 API 特性 封装
 * useInitTable 列表 分页 搜索 删除 修改状态
 * useInitForm  新增 修改
 * **/
import { useInitTable, useInitForm } from "~/composables/useCommon.js";

const {
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleStatusChange,
} = useInitTable({
  searchForm: {
    keyword: "",
  },
  getList: getRoleList,
  delete: deleteRole,
  updateStatus: updateRoleStatus,
});
const {
  formDrawerRef,
  formRef,
  form,
  rules,
  drawerTitle,
  handleSubmit,
  handleCreate,
  handleEdit,
} = useInitForm({
  form: {
    name: "",
    desc: "",
    status: 1,
  },
  rules: {
    name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
  },
  getData,
  update: updateRole,
  create: createRole,
});

const setRuleformDrawerRef = ref(null);
const ruleList = ref([]);
const treeHeight = ref(0);
const roleId = ref(0);
const defaultExpandedKeys = ref([]);
const elTreeRef = ref(null);
const checkStrictly = ref(false);
// 当前用户拥有的权限id
const ruleIds = ref([]);
const openSetRule = (row) => {
  roleId.value = row.id;
  treeHeight.value = window.innerHeight - 170;
  setRuleformDrawerRef.value.open();
  checkStrictly.value = true;
  getRuleList(1).then((res) => {
    defaultExpandedKeys.value = res.list.map((o) => o.id);
    ruleList.value = res.list;

    // 获取当前角色拥有的权限id
    ruleIds.value = row.rules.map((o) => o.id);
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(ruleIds.value);
      checkStrictly.value = false;
    }, 150);
  });
};
const handleSetRuleSubmit = () => {
  setRuleformDrawerRef.value.showLoading();
  setRoleRules(roleId.value, ruleIds.value)
    .then((res) => {
      toast("配置成功");
      setRuleformDrawerRef.value.close();
      getData();
    })
    .finally(() => {
      setRuleformDrawerRef.value.hideLoading();
    });
};

const handleCheck = (...e) => {
  const { checkedKeys, halfCheckedKeys } = e[1];
  ruleIds.value = [...checkedKeys, ...halfCheckedKeys];
};
</script>
