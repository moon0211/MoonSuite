import request from '@/request/http'

export function getMenuList(params) {
    return request({
        url: '/menu',
        method: 'get',
        params: params
    })
}
export function getParentMenuList() {
    return request({
        url: '/parentMenu',
        method: 'get'
    })
}
export function addMenu(params) {
    return request({
        url: '/menu',
        method: 'post',
        data: params
    })
}