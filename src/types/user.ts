
interface Timezone {
    id: string; // 时区 ID
    offset: number; // 时区偏移量
}

export enum AccountLevel {
    Free = 10,
    Advanced = 20,
    Pro = 30,
}

interface User {
    countryCode: string; // 国家码
    phoneNumber: string; // 电话号码
    email?: string; // 用户邮箱
    apikey: string; // 用户标识
    nickname?: string; // 用户昵称
    accountLevel: number; // 账号会员等级（10=Free，20=Advanced，30=Pro）
    levelExpiredAt?: number; // 会员等级到期时间戳（毫秒级，可选，0或空表示无过期时间）
    denyRecharge?: boolean; // 是否禁止充值（空或false表示可充值，true表示禁止）
    accountConsult?: boolean; // 是否接受过会员咨询反馈（可选）
    appForumEnterHide?: boolean; // 是否隐藏APP社区入口（true=隐藏）
    freeTrialExpiredAt?: number; // 免费试用到期时间戳（毫秒级，仅领取过试用的用户返回）
    timezone?: Timezone; // 时区信息（可选）
    appVersion: string; // 当前登录的App版本
    ipCountry: string; // 后台根据IP计算的国家码（Alpha-2格式）
    extraInfo?: UserExtraInfo; // 额外账号信息（小程序相关，可选）
}
interface UserExtraInfo {
    unionid?: string; // 小程序调用时返回的用户 unionid（可选）
    openid?: string; // 小程序调用时返回的用户 openid（可选）
    nickname?: string; // 小程序调用时返回的用户昵称（可选）
    avatar?: string; // 小程序调用时返回的用户头像（可选）
}

// 用户信息接口
export interface UserProfile {
    user: User,
    at?: string,
    rt?: string,
    region: string,
}