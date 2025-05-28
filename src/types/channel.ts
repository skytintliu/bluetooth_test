
// 推送渠道类型枚举（可选，提高可读性）
export enum PushChannelType {
    FCM = 'fcm',
    APNS = 'apns',
    Huawei = 'huawei',
    Xiaomi = 'xiaomi',
    Honor = 'honor',
    Vivo = 'vivo',
    Oppo = 'oppo',
}

// 推送渠道信息（根据类型不同的字段）
export enum FcmPushInfo {
    FCM = 'fcm',
    APNS = 'apns'
}

export interface ApnsPushInfo {
    token: FcmPushInfo; // APNs设备token
}

// 其他渠道可根据需要扩展（示例中以FCM和APNS为主）
export type PushInfo = FcmPushInfo | ApnsPushInfo; // 可扩展为联合类型

// 额外推送信息
export interface ExtraPush {
    type: PushChannelType; // 渠道类型（必填）
    info: PushInfo; // 渠道特定信息（根据type动态匹配）
}