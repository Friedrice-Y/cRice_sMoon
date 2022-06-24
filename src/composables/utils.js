import { ElNotification, ElMessageBox } from "element-plus";
import nprogress from "nprogress";

// 消息提示
export function toast(
  message,
  type = "success",
  dangerouslyUseHTMLString = false
) {
  ElNotification({
    message,
    type,
    dangerouslyUseHTMLString,
    duration: 3000,
  });
}

export function showModal(content = "提示内容", type = "warning", title = "") {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type,
  });
}
// 弹出输入框
export function showPrompt(tip, value = "") {
  return ElMessageBox.prompt(tip, "", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValue: value,
  });
}

// 显示全屏loading
export function showFullLoading() {
  nprogress.start();
}
export function hideFullLoading() {
  nprogress.done();
}

// 将query对象转成url参数
export function queryParams(query) {
  let q = [];
  for (const key in query) {
    if (query[key]) {
      // 防止参数丢失
      // encodeURIComponent()
      // 可把字符串作为URI 组件进行编码。其返回值URIstring 的副本，其中的某些字符将被十六进制的转义序列进行替换。
      q.push(`${key}=${encodeURIComponent(query[key])}`);
    }
  }
  let r = q.join("&"); // r 最终 limit=10&keyword=ceshi
  return (r = r ? "?" + r : "");
}
