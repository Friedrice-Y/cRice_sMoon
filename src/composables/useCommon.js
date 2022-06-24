// 公告代码抽离封装
// 组合式 API 特性封装
import { reactive, ref, computed } from "vue";
import { toast } from "~/composables/utils";
// - 列表 分页 搜索 删除 修改状态
export function useInitTable(opt = {}) {
  let searchForm = null;
  let resetSearchForm = null;
  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm });
    resetSearchForm = () => {
      for (const key in opt.searchForm) {
        searchForm[key] = opt.searchForm[key];
      }
      getData();
    };
  }

  // 加载动画
  const loading = ref(false);
  const tableData = ref([]);

  // 分页
  const currentPage = ref(1);
  const total = ref(0);
  const limit = ref(10);

  function getData(p = null) {
    if (typeof p === "number") {
      currentPage.value = p;
    }
    loading.value = true;
    opt
      .getList(currentPage.value, searchForm)
      .then((res) => {
        if (
          opt.onGetListSuccess &&
          typeof opt.onGetListSuccess === "function"
        ) {
          opt.onGetListSuccess(res);
        } else {
          tableData.value = res.list;
          total.value = res.totalCount;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }

  getData();

  /**
   * 因为删除和修改都需要用到 getData 方法，
   *  索性封装到一起,没必要单独封装
   **/
  // 删除
  const handleDelete = (id) => {
    loading.value = true;
    opt
      .delete(id)
      .then((res) => {
        toast("删除成功");
        getData(1);
      })
      .finally(() => {
        loading.value = false;
      });
  };
  // 修改状态
  const handleStatusChange = (status, row) => {
    row.statusLoading = true;
    opt
      .updateStatus(row.id, status)
      .then((res) => {
        toast("修改状态成功");
        row.status = status;
      })
      .finally(() => {
        row.statusLoading = false;
      });
  };

  // 多选选中的ID数组
  const multiSelectionIds = ref([]);
  const handleSelectionChange = (e) => {
    multiSelectionIds.value = e.map((o) => o.id);
  };
  // 批量删除的方法
  const multipleTableRef = ref(null);
  const handleMultiDelete = () => {
    loading.value = true;
    opt
      .delete(multiSelectionIds.value)
      .then(() => {
        toast("删除成功");
        // 清空选中
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange,
    multipleTableRef,
    handleMultiDelete,
    handleSelectionChange,
  };
}
// - 新增 修改
export function useInitForm(opt = {}) {
  // 表单部分
  const formDrawerRef = ref(null);
  const formRef = ref(null);
  const defaultForm = opt.form;
  const form = reactive({});

  const rules = opt.rules || {};
  const editId = ref(0);
  const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));

  const handleSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) return;
      formDrawerRef.value.showLoading();

      const fun = editId.value
        ? opt.update(editId.value, form)
        : opt.create(form);

      fun
        .then((res) => {
          toast(drawerTitle.value + "成功");
          // 修改刷新当前页,新增刷新第一页
          opt.getData(editId.value ? false : 1);
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
    for (const key in defaultForm) {
      form[key] = row[key];
    }
  };

  // 新增
  const handleCreate = () => {
    editId.value = 0;
    resetFrom(defaultForm);
    formDrawerRef.value.open();
  };
  // 编辑
  const handleEdit = (row) => {
    editId.value = row.id;
    resetFrom(row);
    formDrawerRef.value.open();
  };

  return {
    formDrawerRef,
    formRef,
    form,
    rules,
    editId,
    drawerTitle,
    handleSubmit,
    resetFrom,
    handleCreate,
    handleEdit,
  };
}
