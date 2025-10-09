import { defineStore } from 'pinia'
import { getMenuList } from '../api/menu'

export const useMenuStore = defineStore('menu', {
    state: () => ({
        menuList: [],
        menuTable: [],
        isLoading: false,
        error: null,
        hasAddedRoutes:false
    }),
    actions: {
        async fetchMenuList(type = 'menu') {
            try {
                this.isLoading = true;
                this.error = null;
                // 使用await等待请求完成，并返回结果
                const res = await getMenuList({ format: type });
                this.menuList = res.data;
                return res.data; // 可选：返回数据方便外部使用
            } catch (err) {
                this.error = err;
                throw err; // 抛出错误让调用方处理
            } finally {
                this.isLoading = false;
            }
        },
        // 修复fetchMenuTable
        async fetchMenuTable(type = 'table') {
            try {
                this.isLoading = true;
                this.error = null;
                // 关键：使用await等待接口请求完成
                const res = await getMenuList({ format: type });
                this.menuTable = res.data;
                return res.data; // 可选：返回数据方便外部使用
            } catch (err) {
                this.error = err;
                throw err; // 抛出错误让调用方处理
            } finally {
                this.isLoading = false;
            }
        },
        clearMenuList() {
            this.menuList = []
        },
        clearMenuTable() {
            this.menuTable = []
        }
    }
})