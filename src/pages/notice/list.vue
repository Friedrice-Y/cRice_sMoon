<template>
  <el-card shadow="never" class="boder-0">
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
      <el-table-column prop="title" label="公告标题" width="180" />
      <el-table-column prop="create_time" label="发布时间" width="380" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            text
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-popconfirm
            title="是否要删除该公告?"
            confirmButtonText="提交"
            cancelButtonText="取消"
            @confirm="handleDelete(scope.row.id)"
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
import {
  getNoticeList,
  createNotice,
  deleteNotice,
  updateNotice,
} from "~/api/notice";
import FormDrawer from "~/components/FormDrawer.vue";
/**
 * 公告代码抽离封装
 * 组合式 API 特性 封装
 * useInitTable 列表 分页 搜索 删除 修改状态
 * useInitForm  新增 修改
 * **/
import { useInitTable, useInitForm } from "~/composables/useCommon.js";

const { tableData, loading, currentPage, total, limit, getData, handleDelete } =
  useInitTable({
    searchForm: {
      keyword: "",
    },
    getList: getNoticeList,
    delete: deleteNotice,
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
    title: "",
    content: "",
  },
  rules: {
    title: [{ required: true, message: "公告标题不能为空", trigger: "blur" }],
    content: [{ required: true, message: "公告内容不能为空", trigger: "blur" }],
  },
  getData,
  update: updateNotice,
  create: createNotice,
});
</script>
