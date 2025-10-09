import request from '../request/http'

export function getMenuList(params) {
    return request({
        url: '/menu',
        method: 'get',
        params: params
    })
}