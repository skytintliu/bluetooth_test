<template>
  <view class="device-control">
    <!-- 顶部开关控制 -->
    <view class="power-control">
      <view class="power-btn" :class="{ 'on': isOn }" @click="togglePower">
        <text class="iconfont icon-power"></text>
      </view>
      <text class="power-text">{{ isOn ? '开启' : '关闭' }}</text>
    </view>

    <!-- 亮度和色温控制 -->
    <view class="slider-controls">
      <view class="slider-item">
        <text class="slider-label">亮度</text>
        <slider :value="brightness" @change="onBrightnessChange" min="1" max="100" show-value />
        <!-- <view class="quick-controls">
          <text @click="adjustBrightness('-')">-</text>
          <text @click="adjustBrightness('+')">+</text>
        </view> -->
      </view>
      <view class="slider-item">
        <text class="slider-label">色温</text>
        <slider :value="colorTemp" @change="onColorTempChange" min="0" max="100" show-value />
        <!-- <view class="quick-controls">
          <text @click="adjustColorTemp('-')">-</text>
          <text @click="adjustColorTemp('+')">+</text>
        </view> -->
      </view>
    </view>

    <!-- 灯效模式选择 -->
    <view class="mode-section">
      <text class="section-title">灯效模式</text>
      <view class="mode-grid">
        <view class="mode-item" v-for="item in modeList" :class="{ 'active': currentMode === item.key }"
          @click="switchMode(item)">
          <text class="mode-icon iconfont icon-light"></text>
          <text class="mode-name">{{ item.value }}</text>
        </view>
      </view>
    </view>

    <!-- 情景模式 -->
    <view class="scene-section">
      <text class="section-title">情景模式</text>
      <scroll-view class="scene-scroll" scroll-x>
        <view class="scene-list">
          <view class="scene-item" v-for="scene in scenes" :key="scene.id" @click="activateScene(scene)">
            <image :src="scene.icon" mode="aspectFit" />
            <text>{{ scene.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 高级功能 -->
    <view class="advanced-section">
      <text class="section-title">高级功能</text>
      <view class="advanced-grid">
        <view class="advanced-item" @click="showDelayTimer">
          <text class="advanced-icon iconfont icon-timer"></text>
          <text>延时开关</text>
        </view>
        <view class="advanced-item" @click="togglePowerOnState">
          <text class="advanced-icon iconfont icon-setting"></text>
          <text>上电状态</text>
        </view>
        <view class="advanced-item" @click="toggleGradual('start')">
          <text class="advanced-icon iconfont icon-sunrise"></text>
          <text>缓启</text>
        </view>
        <view class="advanced-item" @click="toggleGradual('stop')">
          <text class="advanced-icon iconfont icon-sunset"></text>
          <text>缓灭</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { BLEEncryptor } from '@/utils/crypto';
import { getSeqence, sendDataToDevice } from '@/utils/device';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
let deviceId = ''
onLoad((opt: any) => {
  deviceId = opt.id;
})
// 状态变量
const isOn = ref(false);
const brightness = ref(50);
const colorTemp = ref(50);
const currentMode = ref('neutral');

interface ModeListType {
  value: string,
  icon: string,
  command: string,
  key: string
}
const modeList: ModeListType[] = [
  { value: '中性光', icon: '/static/icons/neutral.svg', command: "", key: "neutral" },
  { value: '暖光', icon: '/static/icons/warm.svg', command: "", key: 'warm' },
  { value: '白光', icon: '/static/icons/white.svg', command: "", key: 'white' },
  { value: '小夜灯', icon: '/static/icons/night.svg', command: "", key: 'night' },
]

// 情景模式数据
const scenes = ref([
  { id: 1, name: '阅读', icon: '/static/icons/reading.svg' },
  { id: 2, name: '工作', icon: '/static/icons/working.svg' },
  { id: 3, name: '休息', icon: '/static/icons/rest.svg' },
  { id: 4, name: '娱乐', icon: '/static/icons/entertainment.svg' },
]);

// 开关控制
const togglePower = () => {
  isOn.value = !isOn.value;
  sendDataToDevice(deviceId, `0900${getSeqence()}81BFFA000602`, 2);
  // TODO: 发送蓝牙指令
};

// 亮度控制
const onBrightnessChange = (e: any) => {
  brightness.value = e.detail.value;
  sendDataToDevice(deviceId, `0B00${getSeqence()}81BFFAFFFE01${(brightness.value).toString(16).padStart(2, '0')}${(colorTemp.value).toString(16).padStart(2,'0')}`, 2);
  // TODO: 发送蓝牙指令
};

const adjustBrightness = (type: '+' | '-') => {
  if (type === '+' && brightness.value < 100) {
    brightness.value += 1;
  } else if (type === '-' && brightness.value > 1) {
    brightness.value -= 1;
  }
  // TODO: 发送蓝牙指令
};

// 色温控制
const onColorTempChange = (e: any) => {
  colorTemp.value = e.detail.value;
  sendDataToDevice(deviceId, `0B00${getSeqence()}81BFFAFFFE01${(brightness.value).toString(16).padStart(2, '0')}${(colorTemp.value).toString(16).padStart(2,'0')}`, 2);
  // TODO: 发送蓝牙指令
};

const adjustColorTemp = (type: '+' | '-') => {
  if (type === '+' && colorTemp.value < 100) {
    colorTemp.value += 1;
  } else if (type === '-' && colorTemp.value > 0) {
    colorTemp.value -= 1;
  }
  // TODO: 发送蓝牙指令
};

// 模式切换
const switchMode = async(mode: ModeListType) => {
  currentMode.value = mode.key;
  let res = await  sendDataToDevice(deviceId, `0900${getSeqence()}81BFFAFFFE06`, 2);
  console.log(res);
  
  // TODO: 发送蓝牙指令
};

// 情景模式激活
const activateScene = (scene: any) => {
  // TODO: 根据场景配置发送相应指令
};

// 高级功能
const showDelayTimer = () => {
  // TODO: 显示延时设置弹窗
};

const togglePowerOnState = () => {
  // TODO: 切换上电状态
};

const toggleGradual = (type: 'start' | 'stop') => {
  // TODO: 设置缓启/缓灭
};
</script>

<style scoped lang="scss">
.device-control {
  min-height: 100vh;
  padding: 20px;
  background: #f5f5f5;

  .power-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;

    .power-btn {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      transition: all 0.3s;

      &.on {
        background: #4cd964;
      }

      .icon-power {
        font-size: 40px;
        color: #fff;
      }
    }

    .power-text {
      font-size: 16px;
      color: #333;
    }
  }

  .slider-controls {
    background: #fff;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 20px;

    .slider-item {
      margin-bottom: 15px;

      .slider-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
        display: block;
      }

      .quick-controls {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;

        text {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: #f0f0f0;
          border-radius: 15px;
        }
      }
    }
  }

  .section-title {
    font-size: 16px;
    color: #333;
    margin-bottom: 15px;
    display: block;
  }

  .mode-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    background: #fff;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 20px;

    .mode-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      border-radius: 8px;
      transition: all 0.3s;

      &.active {
        background: #e8f5e9;

        .mode-icon {
          color: #4cd964;
        }
      }

      .mode-icon {
        font-size: 24px;
        color: #666;
        margin-bottom: 5px;
      }

      .mode-name {
        font-size: 12px;
        color: #333;
      }
    }
  }

  .scene-section {
    margin-bottom: 20px;

    .scene-scroll {
      width: 100%;

      .scene-list {
        display: flex;
        padding: 15px;
        background: #fff;
        border-radius: 12px;

        .scene-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 20px;

          image {
            width: 40px;
            height: 40px;
            margin-bottom: 5px;
          }

          text {
            font-size: 12px;
            color: #333;
          }
        }
      }
    }
  }

  .advanced-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    background: #fff;
    border-radius: 12px;
    padding: 15px;

    .advanced-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .advanced-icon {
        font-size: 24px;
        color: #666;
        margin-bottom: 5px;
      }

      text {
        font-size: 12px;
        color: #333;
      }
    }
  }
}
</style>