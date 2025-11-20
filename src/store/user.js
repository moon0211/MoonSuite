import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userInfo: {
                username: '',
                avatar: ''
            },
        }
    },
    getters: {
        // 实时计算：每次访问 isLogin 都会检查 localStorage
        isLogin() {
            // 修正拼写：accessToken（如果确实是 assessToken 可保留，但不推荐）
            return !!localStorage.getItem('accessToken')
        }
    },
    actions: {
        setUserInfo(userInfo) {
            this.userInfo = userInfo
            this.isLogin = true
        },
        logout() {
            this.userInfo = null
            this.isLogin = false
        }
    },
    persist: true,
})