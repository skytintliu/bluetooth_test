import request from '@/utils/request'
import { ExtraPush } from '@/types/channel'

interface LoginParams {
  countryCode: string; // 国家码区号，必须以"+"开头（如"+86"）
  password: string; // 密码
  lang: string; // 语言项（仅Web端生效）
  // 邮箱或手机号（互斥，至少选其一）
  email?: string; // 邮箱（与phoneNumber互斥）
  phoneNumber?: string; // 手机号码（以国家码开头，如"+8618023456789"，与email互斥）
  extraPush?: ExtraPush; // 额外推送渠道信息（可选）
}
export const login = (data: LoginParams) => {
  return request.post('/v2/user/login', data)
}

export const refreshToken = (rt: string) => {
  return request.post('/v2/user/refresh', { rt })
}

export const getUserInfo = () => {
  return request.get('/v2/user/profile')
}