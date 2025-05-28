<template>
  <scroll-view :scroll-y="true" class="page">
    <view class="my-container">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="user-info">
          <!-- <image class="avatar" :src="profile.user.avatar || defaultAvatar" mode="aspectFill" /> -->
          <view class="info-content" v-if="isLogin">
            <view class="nickname">{{ profile.user.nickname || profile.user.phoneNumber || profile.user.email ||
              'cooklit'
              }}</view>
            <view class="user-id">ID: {{ profile.user.apikey || '--' }}</view>
            <text class="member-status">{{ AccountLevel[profile.user.accountLevel] }}用户</text>
          </view>
          <view class="info-content" v-else @click="navToLogin">
            <text class="login-tip">点击登录</text>
          </view>
        </view>

      </view>

      <!-- 功能列表 -->
      <view class="function-list">
        <view class="function-group">
          <view class="function-item" @click="navToDeviceList">
            <text class="iconfont icon-device"></text>
            <text class="title">设备管理</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
          <view class="function-item" @click="navToMessageCenter">
            <text class="iconfont icon-message"></text>
            <text class="title">消息中心</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
        </view>

        <view class="function-group">
          <view class="function-item" @click="navToSettings">
            <text class="iconfont icon-settings"></text>
            <text class="title">设置</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
          <view class="function-item" @click="navToHelp">
            <text class="iconfont icon-help"></text>
            <text class="title">帮助与反馈</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
          <view class="function-item" @click="navToAbout">
            <text class="iconfont icon-about"></text>
            <text class="title">关于我们</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
        </view>
      </view>

      <!-- 退出登录按钮 -->
      <button class="logout-btn" v-if="isLogin" @click="handleLogout">退出登录</button>
    </view>
  </scroll-view>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { showToast } from '@/utils/app';

// 默认头像
import { useUserStore } from '@/stores';
import { AccountLevel } from '@/types/user';
const { logout } = useUserStore();

const profile = computed(() => {
  return useUserStore().profile;
});
const isLogin = computed(() => {
  return useUserStore().isLogin;
});

// 跳转到登录页
const navToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  });
};

// 跳转到设备列表
const navToDeviceList = () => {
  uni.navigateTo({
    url: '/pages/device/list'
  });
};

// 跳转到消息中心
const navToMessageCenter = () => {
  uni.navigateTo({
    url: '/pages/message/index'
  });
};

// 跳转到设置页面
const navToSettings = () => {
  uni.navigateTo({
    url: '/pages/settings/index'
  });
};

// 跳转到帮助页面
const navToHelp = () => {
  uni.navigateTo({
    url: '/pages/help/index'
  });
};

// 跳转到关于页面
const navToAbout = () => {
  uni.navigateTo({
    url: '/pages/about/index'
  });
};

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 实现退出登录逻辑
        showToast('退出登录成功');
        logout();
      }
    }
  });
};
</script>

<style lang="scss">
.my-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;

  .user-card {
    background-color: #fff;
    padding: 40rpx 30rpx;
    margin-bottom: 20rpx;

    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;

      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
        margin-right: 20rpx;
      }

      .info-content {
        flex: 1;

        .nickname {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 10rpx;
        }

        .user-id {
          font-size: 24rpx;
          color: #999;
        }

        .login-tip {
          font-size: 32rpx;
          color: #007aff;
        }
      }
    }

    .user-data {
      display: flex;
      justify-content: space-around;
      padding-top: 20rpx;
      border-top: 1rpx solid #eee;

      .data-item {
        text-align: center;

        .num {
          font-size: 36rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 10rpx;
        }

        .label {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }

  .function-list {
    .function-group {
      background-color: #fff;
      margin-bottom: 20rpx;

      .function-item {
        display: flex;
        align-items: center;
        padding: 30rpx;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .iconfont {
          font-size: 40rpx;
          color: #007aff;
          margin-right: 20rpx;

          &.icon-arrow-right {
            margin-right: 0;
            margin-left: auto;
            color: #999;
            font-size: 32rpx;
          }
        }

        .title {
          font-size: 28rpx;
          color: #333;
        }
      }
    }
  }

  .logout-btn {
    width: 90%;
    height: 90rpx;
    line-height: 90rpx;
    margin: 60rpx auto;
    background-color: #fff;
    border-radius: 45rpx;
    color: #ff3b30;
    font-size: 32rpx;
  }
}
</style>