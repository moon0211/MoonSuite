import { createRouter, createWebHistory } from 'vue-router'
import { useMenuStore } from '@/store/menu'
import { useUserStore } from "@/store/user";
import { MessagePlugin } from "tdesign-vue-next";

const routes = [
]
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

function generateRoutes(menuData) {
    const routes = []

    menuData.forEach(menu => {
        if (menu.type === 'menuItem' && menu.value && menu.component) {
            const route = {
                path: menu.value,
                name: menu.title.replace(/[\s]/g, ''),
                component: () => import(`../${menu.component}`),
                meta: {
                    title: menu.title,
                    icon: menu.icon,
                    id: menu.id,
                    requiresAuth: true,
                    fullScreen: menu.fullScreen
                }
            }

            routes.push(route)
        }
    })
    return routes;
}

router.beforeEach(async (to, from, next) => {
    console.log('to: ', to);
    console.log('from: ', from);
    const menuStore = useMenuStore();
    const userStore = useUserStore();

    if (menuStore.hasAddedRoutes) {
        return next();
    }
    try {
        if (!menuStore.routerList || menuStore.routerList.length === 0) {
            await menuStore.fetchRouterList('table');
        }

        const dynamicRoutes = generateRoutes(menuStore.routerList);
        dynamicRoutes.forEach(route => {
            router.addRoute(route);
        });
        menuStore.hasAddedRoutes = true;
        const allRoutes = router.getRoutes()
        console.log('所有路由配置：', allRoutes)
        if (!userStore.isLogin) {
            MessagePlugin.warning('请先登录')
            console.log('to.fullPath: ', to.fullPath);

            const redirectPath = to.path === '/login' ? '/' : to.fullPath;
            next({
                path: '/login',
                query: { redirect: redirectPath }
            });
        }
        return next(to.fullPath);

    } catch (error) {
        console.error('Error fetching menu:', error);
    }
});
export default router