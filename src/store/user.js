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
        isLogin() {
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