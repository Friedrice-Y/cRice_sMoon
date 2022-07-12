import { createRouter, createWebHashHistory } from "vue-router";

import Admin from "~/layout/admin.vue";
import Index from "~/pages/index.vue";
import Login from "~/pages/login.vue";
import NotFound from "~/pages/404.vue";
import GoodList from "~/pages/goods/list.vue";
import CategoryList from "~/pages/category/list.vue";
import UserList from "~/pages/user/list.vue";
import OrderList from "~/pages/order/list.vue";
import CommentList from "~/pages/comment/list.vue";
import ImageList from "~/pages/image/list.vue";
import NoticeList from "~/pages/notice/list.vue";
import SettingBase from "~/pages/setting/base.vue";
import CouponList from "~/pages/coupon/list.vue";
import ManagerList from "~/pages/manager/list.vue";
import AccessList from "~/pages/access/list.vue";
import RoleList from "~/pages/role/list.vue";
import SkusList from "~/pages/skus/list.vue";
// 默认路由 所有用户共享
const routes = [
  {
    path: "/",
    name: "admin",
    component: Admin,
  },
  {
    path: "/login",
    component: Login,
    meta: {
      title: "登录页",
    },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

// 动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [
  {
    path: "/",
    name: "/",
    component: Index,
    meta: {
      title: "后台首页",
    },
  },
  {
    path: "/goods/list",
    name: "/goods/list",
    component: GoodList,
    meta: {
      title: "商品管理",
    },
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: CategoryList,
    meta: {
      title: "分类列表",
    },
  },
  {
    path: "/user/list",
    name: "/user/list",
    component: UserList,
    meta: {
      title: "用户列表",
    },
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: OrderList,
    meta: {
      title: "订单列表",
    },
  },
  {
    path: "/comment/list",
    name: "/comment/list",
    component: CommentList,
    meta: {
      title: "评价列表",
    },
  },
  {
    path: "/image/list",
    name: "/image/list",
    component: ImageList,
    meta: {
      title: "图库列表",
    },
  },
  {
    path: "/notice/list",
    name: "/notice/list",
    component: NoticeList,
    meta: {
      title: "公告列表",
    },
  },
  {
    path: "/setting/base",
    name: "/setting/base",
    component: SettingBase,
    meta: {
      title: "配置",
    },
  },
  {
    path: "/coupon/list",
    name: "/coupon/list",
    component: CouponList,
    meta: {
      title: "优惠卷列表",
    },
  },
  {
    path: "/manager/list",
    name: "/manager/list",
    component: ManagerList,
    meta: {
      title: "管理员管理",
    },
  },
  {
    path: "/access/list",
    name: "/access/list",
    component: AccessList,
    meta: {
      title: "菜单权限管理",
    },
  },
  {
    path: "/role/list",
    name: "/role/list",
    component: RoleList,
    meta: {
      title: "角色管理",
    },
  },
  {
    path: "/skus/list",
    name: "/skus/list",
    component: SkusList,
    meta: {
      title: "规格管理",
    },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export function addRoutes(menus) {
  // 表示当次是否添加有新路由
  let hasNewRoutes = false;

  const findAndAddRoutesByMenus = (frontRoutes) => {
    /*
      <menuItem>{
        frontpath
        child: [<menuItem>{
          frontpath
          child: [<menuItem>{}]
        }]
      }
    */

    frontRoutes.forEach((frontRoutesItem) => {
      // 双重循环查找本地路由列表中符合后台返回路由要求的对象
      let asyncRoutesItemToAdd = asyncRoutes.find(
        // menuItem.frontpath 后台为前端指定需要展示的路径    front => 前端
        (asyncRoutesItem) => asyncRoutesItem.path == frontRoutesItem.frontpath
      );

      // 如果本地列表中存在并且本地初始化路由中还没有添加这个路径
      // 正常添加
      if (asyncRoutesItemToAdd && !router.hasRoute(asyncRoutesItemToAdd.path)) {
        // 添加到 name 为 admin 的路由对象 children 中
        // 如果只传递 item 路由对象,就添加到根路由数组中
        // 筛选 Layout 组件内 router-view 可以显示的内容
        router.addRoute("admin", asyncRoutesItemToAdd);

        // 更新标记,表示有新路由添加
        hasNewRoutes = true;
      }

      // 递归处理 child 内部的 frontRoutesItem
      if (frontRoutesItem.child && frontRoutesItem.child.length > 0) {
        findAndAddRoutesByMenus(frontRoutesItem.child);
      }
    });
  };

  // 变量后台返回的基础数据
  findAndAddRoutesByMenus(menus);

  // 向外传递表示是否已经添加新路由
  return hasNewRoutes;
}

export default router;
