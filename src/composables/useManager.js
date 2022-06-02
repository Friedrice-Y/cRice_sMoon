import { ref, reactive } from "vue";
import { updatePassword, logOut } from "~/api/manager";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { showModal, toast } from "~/composables/utils";

export function useRepassword() {
  const formDrawerRef = ref(null);

  const router = useRouter();
  const store = useStore();

  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });

  const rules = {
    oldpassword: [{ required: true, message: "旧密码必填", trigger: "blur" }],
    password: [{ required: true, message: "新密码必填", trigger: "blur" }],
    repassword: [{ required: true, message: "确认密码必填", trigger: "blur" }],
  };
  const formRef = ref(null);

  const onSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        return false;
      }
      formDrawerRef.value.showLoading();
      updatePassword(form)
        .then((res) => {
          toast("修改密码成功,请重新登录");
          store.dispatch("logOut");
          router.replace("/login");
        })
        .finally(() => {
          formDrawerRef.value.hideLoading();
        });
    });
  };

  const openRePasswordFrom = () => formDrawerRef.value.open();

  return {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePasswordFrom,
  };
}

export function useLogout() {
  const router = useRouter();
  const store = useStore();

  function handleLogout() {
    showModal("是否要退出登录？").then((res) => {
      logOut().finally(() => {
        store.dispatch("logOut");
        // 跳转回登录页
        router.replace("/login");
        // 提示退出登录成功
        toast("退出登录成功");
      });
    });
  }

  return {
    handleLogout,
  };
}
