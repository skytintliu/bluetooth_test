// deviceType.ts
export enum DeviceType {
  风扇 = 0x002B,
  取暖器 = 0x0300,
  双色灯 = 0xBFFA,
  五色灯 = 0xBFFB,
  拇指机器人 = 0xBFFC,
  智能茶吧机 = 0xBFFE,
  智能足浴 = 0xBFFF
}

// 双向映射工具类
export class EnumUtil {
  // 从枚举创建双向映射（支持数值和字符串键）
  static createBiMap<T extends object>(enumObj: T) {
    const map = new Map();
    const reverseMap = new Map();

    // 构建正向映射（名称→值）和反向映射（值→名称）
    for (const [key, value] of Object.entries(enumObj)) {
      map.set(key, value);
      reverseMap.set(value, key);
    }

    return {
      // 支持十进制和十六进制值查找
      getTypeName: (value: number | string) => {
        // 处理字符串格式的十六进制值（如 "0xBFFA"）
        if (typeof value === 'string' && value.startsWith('0x')) {
          return reverseMap.get(parseInt(value, 16));
        }
        // 处理数值格式（十进制或已转换的十六进制）
        return reverseMap.get(Number(value));
      },
      // 根据名称获取值
      getTypeValue: (name: string) => map.get(name)
    };
  }
}

// 创建 DeviceType 的双向映射
export const DeviceTypeMap = EnumUtil.createBiMap(DeviceType);

export interface DeviceConfig {
  /** 获取设备信息的数量，默认值100，范围1-100 */
  num?: number; // 默认值: 100，范围: 1-100

  /** 获取设备信息的起始id，使用上一次查询的结果中devices数组中的最后一个元素的deviceid，不传则从头查询 */
  begin?: string;

  /** 获取设备信息需要的字段 */
  keys?: Array<
    | 'deviceid'
    | 'uiid'
    | 'name'
    | 'familyName'
    | 'params'
    | 'online'
    | 'sharedBy'
    | 'shareTo'
    | 'tags'
    | 'devGroups'
    | 'model'
    | 'familyid'
    | 'devicekey'
  >;

  /** 是否需要获取别人分享的设备，默认值false */
  includeSharedDevice?: boolean; // 默认值: false

  /** 是否需要获取别人分享的家庭下的设备，默认值false */
  includeSharedFamilyDevice?: boolean; // 默认值: false

  /** 获取设备时的筛选字段,目前仅支持按uiid进行筛选 */
  filter?: {
    /** 用于筛选的uiid数组，传了该字段意味着device.keys自动加入uiid */
    uiids: number[]; // 长度范围: >=1
  };
}

export interface GroupConfig {
  /** 获取群组信息的数量，默认值100，范围1-100 */
  num?: number; // 默认值: 100，范围: 1-100

  /** 获取群组信息的起始id，使用上一次查询的结果中groups数组中的最后一个元素的id，不传则从头查询 */
  begin?: string;

  /** 获取群组信息需要的字段 */
  keys?: Array<'id' | 'uiid' | 'name' | 'familyName' | 'groupParams' | 'mainDeviceId'>;

  /** 是否需要获取别人分享的家庭下的群组，默认值false */
  includeSharedFamilyGroup?: boolean; // 默认值: false
}

export interface DeviceAndGroupRequest {
  /** 获取设备信息的配置，不传时不会获取设备信息 */
  device?: DeviceConfig;

  /** 获取群组信息的配置，不传时不会获取群组信息 */
  group?: GroupConfig;
}