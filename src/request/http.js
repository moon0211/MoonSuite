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
// 2. 核心状态：避免重复刷新 Token（防止多请求同时触发刷新）
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
    timeout: 10000, // 刷新 Token 可以设置更长超时时间
    headers: {
        'Content-Type': 'application/json',
    }
});
// 6. 核心：刷新 Token 函数（完善逻辑）
async function refreshToken() {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            refreshRequestQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;
    const storedRefreshToken = localStorage.getItem('refreshToken');

    try {
        if (!storedRefreshToken) {
            throw new Error('刷新 Token 不存在');
        }

        const res = await refreshRequest.post('/refresh', { refreshToken: storedRefreshToken });
        console.log('刷新接口返回：', res);

        if (res.code === 4001) {
            throw new Error('刷新 Token 已过期，请重新登录');
        }
        if (res.code !== 200 || !res.data.accessToken) {
            throw new Error('刷新 Token 接口返回异常');
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        const userStore = getUserStore();
        userStore?.setToken?.(newAccessToken, newRefreshToken);

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
        const currentTime = Date.now();
        console.log('currentTime >= expireTime: ', currentTime >= expireTime);

        if (currentTime >= expireTime) {
            try {
                // 尝试刷新 Token，若失败会抛出错误
                const newAccessToken = await refreshToken();
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } catch (refreshError) {
                // 刷新失败（如 refreshToken 过期），直接终止原请求
                return Promise.reject(refreshError);
            }
        } else {
            config.headers['Authorization'] = `Bearer ${storedAccessToken}`;
        }
    } else {
        logout();
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// 8. 响应拦截器（完善 401 兜底处理）
request.interceptors.response.use((response) => {
    const res = response.data;
    // 后端自定义错误码（非 200 范围视为失败）
    if (res.code < 200 || res.code >= 300) {
        console.error('请求失败：' + (res.message || '请求错误'));
        return Promise.reject(new Error(res.message || '请求错误'));
    }
    return res;
}, async (error) => {
console.log('error: ', error);
    const originalRequest = error.config;
    const response = error.response;

    // 情况1：401 错误（Token 无效/过期，且未重试过）
    if (response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // 标记为已重试，防止循环重试
        try {
            // 尝试刷新 Token
            const newAccessToken = await refreshToken();
            // 刷新成功：用新 Token 重新发起原请求
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return request(originalRequest); // 重新请求
        } catch (refreshError) {
            // 刷新失败：直接 reject，不再重试
            return Promise.reject(refreshError);
        }
    }

    // 情况2：其他错误（非 401 或已重试过）
    const errorMsg = response?.data?.message || error.message || '网络请求失败';
    console.error('请求失败：' + errorMsg);
    return Promise.reject(new Error(errorMsg));
});


// 登出函数
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