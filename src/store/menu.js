import { defineStore } from 'pinia'
import { getMenuList } from '../api/menu'

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
                this.routerList = res.data;
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
                console.log('his.menuTable : ',this.menuTable );
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