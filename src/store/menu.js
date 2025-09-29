import { defineStore } from 'pinia'
import { getMenuList } from '../api/menu'

export const useMenuStore = defineStore('menu', {
    state: () => ({
        menuList: [],
        isLoading: false,
        error: null
    }),
    actions: {
        async fetchMenuList() {
            getMenuList().then(res => {
                this.menuList = res.data
            })
        },
        clearMenuList() {
            this.menuList = []
        }
    }
})