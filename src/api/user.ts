import Ajax from '@/utils/http'
import { ResponseData } from '@/api/response'

export function login<T>(data: T) {
    return Ajax.post('/api/login', data)
}

export function getUserInfo<T>(data: string) {
    return Ajax.post<ResponseData<T>>('/api/getUserInfo', data)
}
