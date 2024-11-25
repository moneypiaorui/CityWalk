import { createRouter, createWebHistory ,createWebHashHistory } from "vue-router";
import Layout from "@/layout/index.vue";
const routes = [
    {
        path: "/",
        component: Layout,
        redirect: "/home",
        children:[
            {
                path: "home",
                name:"home",
                component: () => import("@/views/home/index.vue")
            },
            {
                path: "share",
                name:"share",
                component: () => import("@/views/share/index.vue")
            },
            {
                path: "profile",
                name:"profile",
                component: () => import("@/views/profile/index.vue")
            }
        ]
        
    },
    { path: "/aboutTour",
        name:"aboutTour",
        component: () => import("@/views/about/index.vue") },
    { path: "/createTour",
        name:"createTour",
        component: () => import("@/views/createTour/index.vue") },
        { path: "/showTour",
            name:"showTour",
            component: () => import("@/views/showTour/index.vue") },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});