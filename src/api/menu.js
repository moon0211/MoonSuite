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
export function updateMenu(params) {
    return request({
        url: '/menu/' + params.formData.id,
        method: 'put',
        data: params
    })
}

export function deleteMenu(id) {
    return request({
        url: '/menu/' + id,
        method: 'delete'
    })
}