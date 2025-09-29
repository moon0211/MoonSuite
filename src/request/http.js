import axios from "axios";

const request = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
})


request.interceptors.request.use((config) => {
    const token = 'hello'
    if (token) {
        config.headers['Authorization'] = token
    }
    return config
},
    (error) => {
        return Promise.reject(error)
    }
)

request.interceptors.response.use((response) => {
    const res = response.data
    if (res.code !== 200) {
        console.error('请求失败：' + res.message || '请求错误')
        return Promise.reject(res.message || '请求错误')
    }
    return res
},
    (error) => {
        console.error('请求失败：' + error.message)
        return Promise.reject(error)
    }
)


export default request