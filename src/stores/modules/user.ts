import { ref } from 'vue';
import { defineStore } from 'pinia';
import { UserProfile } from '@/types/user';
import config from '@/config';
const defaultProfile = {
    user: {
        countryCode: "CN",
        phoneNumber: "13800138000",
        email: "user@example.com",
        apikey: "",
        nickname: "张三",
        accountLevel: 20, // Advanced会员
        appVersion: "3.1.5",
        ipCountry: "CN",
        // 可选字段示例
        levelExpiredAt: 1684329600000, // 2023-05-18 00:00:00
        denyRecharge: false,
        appForumEnterHide: true,
        timezone: { id: "Asia/Shanghai", offset: 8 },
        extraInfo: {
            unionid: "o_xxxxxx",
            openid: "open_xxxxxx",
            nickname: "小程序用户",
            avatar: "https://example.com/avatar.png"
        }
    },
    at: "",
    rt: "",
    region: "",
}
// 定义 Store
export const useUserStore = defineStore(
    'user',
    () => {
        // 会员信息
        const profile = ref<UserProfile>(defaultProfile);

        const isLogin = ref<boolean>(Boolean(uni.getStorageSync('at')));
        const setIsLogin = (bool: boolean) => {
            if (isLogin.value == bool) return;
            isLogin.value = bool;
        }

        const logout = (): void => {
            profile.value = defaultProfile;
            uni.clearStorageSync();
            setIsLogin(false);
        }
        const setAuthTokens = (data: { at: string, rt: string }): void => {
            uni.setStorageSync('at', data.at)
            uni.setStorageSync('rt', data.rt)
            
            uni.setStorageSync('at_expire', String(config.at_expire))

        }
        const setProfile = (data: UserProfile): void => {
            if (data.at && data.rt) {
                setAuthTokens({ at: data.at, rt: data.rt })
            }
            setIsLogin(true);
            console.log('设置成功');
            
            // setAuthTokens()
            profile.value = data;
        }

        return {
            profile,
            isLogin,
            setProfile,
            logout,
            setIsLogin,
            setAuthTokens
        };
    },

);