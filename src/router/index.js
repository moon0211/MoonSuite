import { createRouter, createWebHistory } from 'vue-router'

import { useMenuStore } from '../store/menu'

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
                    requiresAuth: true
                }
            }
            routes.push(route)
        }
    })
    return routes;
}

router.beforeEach(async (to, from, next) => {
    const menuStore = useMenuStore();

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
        return next(to.fullPath);

    } catch (error) {
        console.error('Error fetching menu:', error);
    }
});
export default router