export interface FamilyMemberExtraInfo {
    nickname?: string; // 用户的微信昵称（可选）
    avatar?: string;  // 用户的微信头像（可选）
}

export interface FamilyMember {
    apikey: string;           // 用户apikey
    phoneNumber?: string;     // 手机号码（与email至少有一个）
    email?: string;           // 邮箱（与phoneNumber至少有一个）
    nickname: string;         // 昵称
    comment?: string;         // 备注（可选）
    extraInfo?: FamilyMemberExtraInfo; // 微信额外信息（可选）
    shareDate?: Date;         // 分享时间（仅主人可见）
    expiredAt?: Date;         // 过期时间（访客仅见自身，主人可见所有）
}

export interface FamilyOwnerInfo {
    apikey: string;           // 家庭主人的apikey
    phoneNumber: string;      // 家庭主人的电话号码
    email: string;            // 家庭主人的邮箱
    nickname: string;         // 家庭主人的昵称
}

export interface Room {
    id: string;               // 房间id
    name: string;             // 房间名称
    index: number;            // 房间排序号（可能为负数）
}
export enum FamilyType {
    OWN = 1,
    SHARED = 2
}
export interface Family {
    id: string;               // 家庭id
    name: string;             // 家庭名称
    index: number;            // 家庭排序号（可能为负数）
    roomList: Room[];         // 房间列表
    familyType: FamilyType;
    members: FamilyMember[];  // 家庭成员信息列表
    sharedBy?: FamilyOwnerInfo; // 家庭主人信息（仅家庭成员调用接口时返回）
}

export interface UserFamilyData {
    familyList: Family[];     // 家庭列表
    currentFamilyId: string;  // 当前家庭id
}

