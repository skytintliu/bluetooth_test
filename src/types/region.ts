// 国家/地区配置
export interface Region {
  code: string;  // 国家/地区代码
  name: string;  // 国家/地区名称
  phoneCode: string;  // 电话区号
}

// 默认地区
export const DEFAULT_REGION: Region = {
  code: 'CN',
  name: '中国',
  phoneCode: '86'
};

// 支持的国家/地区列表
export const REGION_LIST: Region[] = [
  DEFAULT_REGION,
  {
    code: 'US',
    name: '美国',
    phoneCode: '1'
  },
  {
    code: 'JP',
    name: '日本',
    phoneCode: '81'
  },
  {
    code: 'KR',
    name: '韩国',
    phoneCode: '82'
  },
  {
    code: 'GB',
    name: '英国',
    phoneCode: '44'
  },
  {
    code: 'DE',
    name: '德国',
    phoneCode: '49'
  },
  {
    code: 'FR',
    name: '法国',
    phoneCode: '33'
  },
  {
    code: 'AU',
    name: '澳大利亚',
    phoneCode: '61'
  },
  {
    code: 'CA',
    name: '加拿大',
    phoneCode: '1'
  },
  {
    code: 'SG',
    name: '新加坡',
    phoneCode: '65'
  },
  {
    code: 'MY',
    name: '马来西亚',
    phoneCode: '60'
  },
  {
    code: 'TH',
    name: '泰国',
    phoneCode: '66'
  }
];