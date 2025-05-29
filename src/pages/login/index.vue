<template>
    <view class="login-container">
        <view class="login-header">
            <image class="logo" src="/static/icons/logo.png" />
            <text class="title">欢迎登录</text>
        </view>

        <view class="login-form">
            <view class="form-item region-select">
                <picker :range="regionList" range-key="name" :value="selectedRegionIndex" @change="onRegionChange">
                    <view class="picker-content">
                        <text class="region-name">{{ currentRegion.name }}</text>
                        <text class="phone-code">+{{ currentRegion.phoneCode }}</text>
                    </view>
                </picker>
            </view>
            <view class="form-item">
                <input class="input" type="text" v-model="form.username" placeholder="请输入用户名/手机号" />
            </view>
            <view class="form-item password-input">
                <input class="input" :type="showPassword ? 'text' : 'password'" v-model="form.password"
                    placeholder="请输入密码" />
                <text class="toggle-password" @click="togglePassword">{{ showPassword ? '隐藏' : '显示' }}</text>
            </view>

            <button class="login-btn" @click="handleLogin">登录</button>

            <view class="other-options">
                <text class="forget-pwd" @click="navToForgetPwd">忘记密码？</text>
                <text class="register" @click="navToRegister">注册账号</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { showToast } from '@/utils/app';
import { REGION_LIST, DEFAULT_REGION, type Region } from '@/types/region';
import { login } from '@/api/user';
const form = ref({
    username: '15779068738',
    password: "12345678"
});

const showPassword = ref(false);

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const regionList = ref<Region[]>(REGION_LIST);
const selectedRegionIndex = ref(0);

const currentRegion = computed(() => regionList.value[selectedRegionIndex.value] || DEFAULT_REGION);

const onRegionChange = (e: any) => {
    selectedRegionIndex.value = e.detail.value;
};

onMounted(() => {

});

import { useUserStore } from '@/stores/modules/user';
import { Navigation } from '@/utils/navigation';
const { setProfile, profile } = useUserStore();
const handleLogin = async () => {
    if (!form.value.username) {
        showToast('请输入用户名');
        return;
    }
    if (!form.value.password) {
        showToast('请输入密码');
        return;
    }

    let data = {
        countryCode: `+${currentRegion.value.phoneCode}`,
        password: form.value.password,
        lang: "en",
        phoneNumber: `+${currentRegion.value.phoneCode}${form.value.username}`
    };

    let res = await login(data);
    if (res.error == 0) {
        setProfile(res.data);

        Navigation.reLaunch("/pages/index/index");
    }
};

const navToForgetPwd = () => {
    uni.navigateTo({
        url: '/pages/login/forget'
    });
};

const navToRegister = () => {
    uni.navigateTo({
        url: '/pages/login/register'
    });
};
</script>

<style lang="scss">
.login-container {
    min-height: calc(100vh --window-top);
    padding: 40rpx;
    background-color: #fff;

    .login-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 100rpx;
        margin-bottom: 80rpx;

        .logo {
            width: 160rpx;
            height: 160rpx;
            margin-bottom: 30rpx;
        }

        .title {
            font-size: 40rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .login-form {
        .form-item {
            margin-bottom: 30rpx;

            &.region-select {
                .picker-content {
                    height: 90rpx;
                    padding: 0 30rpx;
                    background-color: #f8f8f8;
                    border-radius: 45rpx;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .region-name {
                        font-size: 28rpx;
                        color: #333;
                    }

                    .phone-code {
                        font-size: 28rpx;
                        color: #666;
                    }
                }
            }

            &.password-input {
                position: relative;

                .toggle-password {
                    position: absolute;
                    right: 30rpx;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 28rpx;
                    color: #007aff;
                    z-index: 1;
                }
            }

            .input {
                height: 90rpx;
                padding: 0 30rpx;
                background-color: #f8f8f8;
                border-radius: 45rpx;
                font-size: 28rpx;

                &[type="password"] {
                    padding-right: 100rpx;
                }
            }
        }

        .login-btn {
            width: 100%;
            height: 90rpx;
            line-height: 90rpx;
            background-color: #007aff;
            color: #fff;
            font-size: 32rpx;
            border-radius: 45rpx;
            margin: 60rpx 0;
        }

        .other-options {
            display: flex;
            justify-content: space-between;
            font-size: 28rpx;

            .forget-pwd,
            .register {
                color: #007aff;
            }
        }
    }
}



.small_product_img {
    position: relative;
    overflow: hidden; /* 防止图片缩放时溢出容器 */
    transition: all 0.3s ease; /* 容器整体过渡效果 */
}

.small_product_img::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.4); /* 渐变遮罩 */
    opacity: 0;
    transform: translateY(10px); /* 初始位置下移，增强过渡效果 */
    transition: opacity 0.3s ease, transform 0.3s ease; /* 遮罩层的透明度和位置过渡 */
    z-index: 10;
}

.small_product_img:hover::after {
    opacity: 1;
    transform: translateY(0); /* 恢复原始位置 */
}

/* 图片本身的动画效果 */
.small_product_img img {
    transition: all 0.3s ease; /* 图片的所有变化都有过渡效果 */
}

.small_product_img:hover img {
    transform: scale(1.05);
}

</style>