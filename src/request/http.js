import axios from "axios";
import { useUserStore } from '@/store/user';
import { getActivePinia } from 'pinia';
import { apiRefreshToken } from '@/api/login'
const request = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
})
let isRefreshing = false;
// 存储等待刷新的请求队列（刷新成功后重新发起）
let refreshRequestQueue = [];

function parseJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('JWT 解析失败', e);
        return null;
    }
}

function getUserStore() {
    const pinia = getActivePinia();
    if (!pinia) {
        console.error('Pinia 未初始化');
        return null;
    }
    const userStore = useUserStore(pinia);
    return userStore
}
const refreshRequest = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});
async function refreshToken() {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            refreshRequestQueue.push({ resolve, reject });
            setTimeout(() => {
                reject(new Error('Token 刷新超时，请重试'));
            }, 30000);
        });
    }

    isRefreshing = true;
    const storedRefreshToken = localStorage.getItem('refreshToken');
    try {
        if (!storedRefreshToken) {
            throw new Error('刷新 Token 不存在');
        }
        const payload = parseJWT(storedRefreshToken);
        if (!payload || !payload.exp) {
            throw new Error('Token 格式异常');
        }
        const { data } = await refreshRequest.post('/refreshToken', { refreshToken: storedRefreshToken });
        if (data.code === 401) {
            logout();
        }
        const { accessToken: newAccessToken } = data.data;
        localStorage.setItem('accessToken', newAccessToken);
        refreshRequestQueue.forEach(({ resolve }) => resolve(newAccessToken));
        refreshRequestQueue = [];
        return newAccessToken;

    } catch (error) {
        refreshRequestQueue.forEach(({ reject }) => reject(error));
        refreshRequestQueue = [];
        logout();
        throw error;

    } finally {
        isRefreshing = false;
    }
}

request.interceptors.request.use(async (config) => {
    const storedAccessToken = localStorage.getItem('accessToken');

    if (storedAccessToken) {
        const payload = parseJWT(storedAccessToken);
        if (!payload || !payload.exp) {
            logout();
            return Promise.reject(new Error('Token 格式异常'));
        }

        const expireTime = payload.exp * 1000;
        // const expireTime = 1763629118307;
        const currentTime = Date.now();
        const qianExpire = 30 * 1000;

        if (currentTime >= expireTime - qianExpire) {
            try {
                const newAccessToken = await refreshToken();
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } catch (refreshError) {
                logout();
                return Promise.reject(refreshError);
            }
        } else {
            config.headers['Authorization'] = `Bearer ${storedAccessToken}`;
        }
    } else {
        if (!window.location.pathname.includes('/login')) {
            logout();
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

request.interceptors.response.use((response) => {
    const res = response.data;
    if (res.code < 200 || res.code >= 300) {
        console.error('请求失败：' + (res.message || '请求错误'));
        return Promise.reject(new Error(res.message || '请求错误'));
    }
    return res;
}, async (error) => {
    const originalRequest = error.config;
    const response = error.response;
    if (response?.status === 401) {
        logout();
    }
    if (response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const newAccessToken = await refreshToken();
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return request(originalRequest);
        } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
        }
    }

    const errorMsg = response?.data?.message || error.message || '网络请求失败';
    console.error('请求失败2131：' + errorMsg);
    return Promise.reject(new Error(errorMsg));
});


function logout() {
    const userStore = getUserStore();
    userStore?.logout?.();

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');

    if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
    }
}


export default request