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
              <small>ID:{{ row.id }}}</small>
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
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
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
            @confirm="handleClick(scope.row.id)"
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
    <FormDrawer ref="formDrawerRef" title="新增" @submit="handleSubmit">
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="form.content"
            placeholder="公告内容"
            type="textarea"
            :rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
<script setup>
import { reactive, ref, computed } from "vue";
import {
  getNoticeList,
  createNotice,
  deleteNotice,
  updateNotice,
} from "~/api/notice";
import FormDrawer from "~/components/FormDrawer.vue";
import { toast } from "~/composables/utils";

import { getManagerList } from "~/api/manager";

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

const tableData = ref([]);

function getData(p = null) {
  if (typeof p === "number") {
    currentPage.value = p;
  }
  loading.value = true;
  getManagerList(currentPage.value, searchform)
    .then((res) => {
      tableData.value = res.list;
      total.value = res.totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
}

getData();
// 删除
const handleClick = (id) => {
  loading.value = true;
  deleteNotice(id)
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
  title: "",
  content: "",
});

const rules = {
  title: [{ required: true, message: "公告标题不能为空", trigger: "blur" }],
  content: [{ required: true, message: "公告内容不能为空", trigger: "blur" }],
};

const editId = ref(0);
const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;
    formDrawerRef.value.showLoading();

    const fun = editId.value
      ? updateNotice(editId.value, form)
      : createNotice(form);

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
  resetFrom({ title: "", content: "" });
  formDrawerRef.value.open();
};
// 修改
const handleEdit = (row) => {
  editId.value = row.id;
  resetFrom(row);
  formDrawerRef.value.open();
};
</script>
