import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/layout/index.vue";

// 路由配置集中化管理
const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "home", 
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
          keepAlive: true
        }
      },
      {
        path: "share",
        name: "share",
        component: () => import("@/views/share/index.vue"),
        meta: {
          title: "社区"
        }
      },
      {
        path: "profile", 
        name: "profile",
        component: () => import("@/views/profile/index.vue"),
        meta: {
          title: "我的"
        }
      }
    ]
  },
  {
    path: "/tour",
    redirect: "/tour/create",
    children: [
      {
        path: "create",
        name: "createTour",
        component: () => import("@/views/createTour/index.vue"),
        meta: {
          title: "创建路线"
        }
      },
      {
        path: "show",
        name: "showTour", 
        component: () => import("@/views/showTour/index.vue"),
        meta: {
          title: "路线详情"
        }
      }
    ]
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});