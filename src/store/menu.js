import { defineStore } from 'pinia'
import { getMenuList } from '@/api/menu'
import router from '../router';
export const useMenuStore = defineStore('menu', {
    state: () => ({
        menuList: [],//菜单列表（nav导航栏）
        routerList: [],//路由列表
        menuTable: [],//菜单管理列表（用于table）
        isLoading: false,
        error: null,
        hasAddedRoutes: false
    }),
    actions: {
        async fetchMenuList(type = 'menu') {
            try {
                this.isLoading = true;
                this.error = null;
                const res = await getMenuList({ format: type });
                this.menuList = res.data;
                return res.data;
            } catch (err) {
                this.error = err;
                throw err;
            } finally {
                this.isLoading = false;
            }
        },
        async fetchRouterList(type = 'table') {
            try {
                this.isLoading = true;
                this.error = null;
                const res = await getMenuList({ format: type });
                let list = this.routerList = res.data;

                list.forEach(menu => {

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



                        router.addRoute(route)
                    }


                })

                return res.data;
            } catch (err) {
                this.error = err;
                throw err;
            } finally {
                this.isLoading = false;
            }
        },
        async fetchMenuTable(type = 'menu', page = 1, pageSize = 10) {
            try {
                this.isLoading = true;
                this.error = null;
                const res = await getMenuList({ format: type, page, pageSize });
                this.menuTable = res.data;
                return res.data;
            } catch (err) {
                this.error = err;
                throw err;
            } finally {
                this.isLoading = false;
            }
        },
        clearMenuList() {
            this.menuList = []
        },
        clearRouterList() {
            this.routerList = []
        },
        clearMenuTable() {
            this.menuTable = []
        }
    }
})