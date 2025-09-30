import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'maindashboard',
        component: () => import('../views/MainDashboard/index.vue')
    },
    {
        path: '/permissionList',
        name: 'PermissionList',
        component: () => import('../views/permission/permissionlist/index.vue')
    },
    {
        path: '/permissionDetail',
        name: 'PermissionDetail',
        component: () => import('../views/permission/dermissiondetail/index.vue')
    },
    {
        path: '/menu',
        name: 'Menu',
        component: () => import('../views/menu/index.vue')
    }
]
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router