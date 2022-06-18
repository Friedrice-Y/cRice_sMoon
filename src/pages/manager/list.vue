<template>
  <el-card shadow="never" class="boder-0">
    <el-form :model="searchform" label-width="80px" class="mb-3" size="small">
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-form-item label="关键词">
            <el-input
              v-model="searchform.keyword"
              placeholder="管理员昵称"
              clearable
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="8" :offset="8">
          <div class="flex items-center justify-end">
            <el-button type="primary" @click="getData">搜索</el-button>
            <el-button @click="resetSearchForm">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <div class="flex items-center mb-4 justify-between">
      <el-button type="primary" size="small" @click="handleCreate"
        >新增</el-button
      >
      <el-tooltip effect="dark" content="刷新数据" placement="top-start">
        <el-button text @click="getData">
          <el-icon :size="20">
            <Refresh />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column label="管理员" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :size="40" :src="row.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
            <div class="ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID:{{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属管理员" align="center">
        <template #default="{ row }">
          {{ row.role?.name || "-" }}
          <!-- row.role?.name 相当于 row.role ? row.role.name : '' -->
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange($event, row)"
            :loading="row.statusLoading"
            :disabled="row.super == 1"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <small v-if="scope.row.super == 1" class="text-sm text-gray-500"
            >暂无操作</small
          >
          <div v-else>
            <el-button
              type="primary"
              size="small"
              text
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              title="是否删除该管理员？"
              confirmButtonText="提交"
              cancelButtonText="取消"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
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
    <FormDrawer ref="formDrawerRef" title="新增" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" label-width="80px" :inline="false">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="用户密码"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <ChooseImage v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="选择所属角色">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="content">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
<script setup>
import { reactive, ref, computed } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
import { toast } from "~/composables/utils";
import ChooseImage from "~/components/ChooseImage.vue";

import {
  getManagerList,
  updateManagerStatus,
  createManager,
  updateManager,
  deleteManager,
} from "~/api/manager";

// 加载动画
const loading = ref(false);

// 分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

const searchform = reactive({
  keyword: "",
});

// 重置管理员搜索表单
const resetSearchForm = () => {
  searchform.keyword = "";
  // 重新获取数据,刷新页面表单
  getData();
};

const roles = ref([]);

const tableData = ref([]);

function getData(p = null) {
  if (typeof p === "number") {
    currentPage.value = p;
  }
  loading.value = true;
  getManagerList(currentPage.value, searchform)
    .then((res) => {
      tableData.value = res.list.map((o) => {
        o.statusLoading = false;
        return o;
      });
      total.value = res.totalCount;
      roles.value = res.roles;
    })
    .finally(() => {
      loading.value = false;
    });
}

getData();
// 删除
const handleDelete = (id) => {
  loading.value = true;
  deleteManager(id)
    .then((res) => {
      toast("删除成功");
      getData(1);
    })
    .finally(() => {
      loading.value = false;
    });
};

// 表单部分
const formDrawerRef = ref(null);
const formRef = ref(null);
const form = reactive({
  username: "",
  password: "",
  row_id: null,
  status: 1,
  avatar: "",
});
const editId = ref(0);
const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;
    formDrawerRef.value.showLoading();

    const fun = editId.value
      ? updateManager(editId.value, form)
      : createManager(form);

    fun
      .then((res) => {
        toast(drawerTitle.value + "成功");
        // 修改刷新当前页,新增刷新第一页
        getData(editId.value ? false : 1);
        formDrawerRef.value.close();
      })
      .finally(() => {
        formDrawerRef.value.hideLoading();
      });
  });
};
// 重置表单
const resetFrom = (row = false) => {
  if (formRef.value) formRef.value.clearValidate();
  if (row) {
    for (const key in row) {
      form[key] = row[key];
    }
  }
};

// 新增
const handleCreate = () => {
  editId.value = 0;
  resetFrom({
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: "",
  });
  formDrawerRef.value.open();
};
// 编辑
const handleEdit = (row) => {
  editId.value = row.id;
  resetFrom(row);
  formDrawerRef.value.open();
};

// 修改状态
const handleStatusChange = (status, row) => {
  row.statusLoading = true;
  updateManagerStatus(row.id, status)
    .then((res) => {
      toast("修改状态成功");
      row.status = status;
    })
    .finally(() => {
      row.statusLoading = false;
    });
};
</script>
