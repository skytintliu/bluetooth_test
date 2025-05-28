import { DeviceAndGroupRequest } from '@/types/device'
import request, { RequestConfig } from '@/utils/request'
export const getThing = (options: RequestConfig) => {
    return request.get('/v2/device/thing', options)
}
export const checkDevice = (data: {
    deviceid: string,
    deviceSign: string,
    randomNumber: Number,
}) => {
    return request.post('/v2/device/check-ble-by-crc32', data)
}

export const addDevice = (data: {
    name?: string,
    code: string,
    deviceTags?: Object,
}) => {
    return request.post('/v2/device/add-ble-by-crc32', data)
}

export const allThingList = (data: DeviceAndGroupRequest) => {
    return request.post('/v2/device/all-thing-list',data)
}