import request from '../request/http'

export function getMenuList() {
    return request({
        url: '/menu',
        method: 'get'
    })
}