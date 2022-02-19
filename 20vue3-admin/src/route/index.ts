import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "Dashboard",
        },
      },
    ],
  },
];
const router = createRouter({
  routes,
  history: createWebHashHistory(),
});
export default router;
