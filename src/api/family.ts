import request, { RequestConfig } from '@/utils/request'
export const getFamily = (options?: RequestConfig) => {
    return request.get('/v2/family', options)
}