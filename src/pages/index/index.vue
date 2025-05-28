<!-- 蓝牙设备扫描和连接页面 -->
<template>
  <!-- 主容器 -->
  <view class="content">
    <!-- 扫描按钮：根据扫描状态显示不同文本，扫描中禁用按钮 -->
    <button class="scan-btn" @click="startScan" :disabled="isScanning">{{ isScanning ? '扫描中...' : '开始扫描' }}</button>

    <!-- 设备列表：当有设备时显示 -->
    <view class="device-list" v-if="deviceList.length > 0">
      <!-- 设备项：循环渲染每个蓝牙设备 -->
      <view v-for="device in deviceList">
        <view class="device-item" v-if="device.RSSI > -80">
          <view class="device-info">
            <!-- 设备名称：优先显示name，其次localName，都没有则显示未知设备 -->
            <text class="device-name">{{ device.localName || device.meta.deviceType.name || '未知设备' }}</text>
            <!-- 设备ID -->
            <text class="device-id">ID: {{ device.deviceId }}</text>
          </view>
          <!-- 连接按钮：连接中禁用按钮并显示不同文本 -->
          <button class="connect-btn" @click="handleClick(device)" :disabled="device.connecting == 1">
            {{ ['连接', '连接中...', '断开'][device.connecting] }}
          </button>
          <button @click='toDetail(device.deviceId)'>
            详情
          </button>
          <button @click='test(device.deviceId)'>
            测试
          </button>
        </view>
      </view>
    </view>

    <!-- 无设备提示：当没有设备时显示 -->
    <view class="no-devices" v-else>
      <text>{{ isScanning ? '搜索设备中...' : '暂无设备' }}</text>
    </view>
  </view>
</template>

<script setup>
import { disconnectDevice } from "@/utils/device";
import crc32 from "@/utils/crc32";
// 导入所需的Vue组件
import { onMounted, ref } from 'vue';

/**
 * 将ArrayBuffer转换为十六进制字符串
 * @param {ArrayBuffer} buffer - 需要转换的二进制数据
 * @returns {string} - 转换后的十六进制字符串
 */

// 状态变量
const isScanning = ref(false); // 是否正在扫描设备
const deviceList = ref([]); // 已发现的蓝牙设备列表


import config from '@/config';
import { BLEEncryptor } from '@/utils/crypto';
import { addDevice, allThingList, checkDevice } from '@/api/device';
import { getSeqence, parseCoolKitAdvertiserData, sendDataToDevice } from "@/utils/device";
import { ab2hex } from "@/utils/app";
import { Navigation } from "@/utils/navigation";

const toDetail = (id) => {
  Navigation.navigateTo(`/pages/device/index?id=${id}`)
}

const test = async (deviceId) => {
  let result = await sendDataToDevice(deviceId, `0900${getSeqence()}81BFFAFFFE0A000a`, 2);
  console.log(result);
}

const handleClick = (device) => {
  if (device.connecting == 2) {
    disconnectDevice(device.deviceId);
    device.connecting = 0;
  } else { connectDevice(device); }
}
/**
 * 开始扫描蓝牙设备
 * 1. 初始化蓝牙适配器
 * 2. 开始搜索附近的蓝牙设备
 */
const startScan = async () => {
  isScanning.value = true;
  deviceList.value = [];
  try {
    await uni.openBluetoothAdapter();
    await uni.startBluetoothDevicesDiscovery()
  } catch (err) {
    isScanning.value = false;
    // 提示用户检查蓝牙状态
    uni.showToast({
      title: '请检查蓝牙是否开启',
      icon: 'none'
    });
  }
};

onMounted(() => {
  // 初始化蓝牙
  uni.onBluetoothDeviceFound((result) => {

    const newDevice = result.devices[0];
    // 检查设备是否已存在于列表中，避免重复添加
    const existingDevice = deviceList.value.find(d => d.deviceId === newDevice.deviceId);
    if (!existingDevice && ab2hex(newDevice.advertisData).startsWith('0aca')) {
      let data = {
        meta: parseCoolKitAdvertiserData(ab2hex(newDevice.advertisData)),
        ...newDevice,
        connecting: 0, // 添加连接状态标识
      };
      deviceList.value.push(data);
    }
  });
});

// const switchLamp = async (device) => {
//   sendDataToDevice(device.deviceId, `0900${getSeqence()}81BFFA000602`, 2);
//   let data4 = await getData();
//   data4 = BLEEncryptor.decrypt(ab2hex(data4.value), 2);
//   console.log('解析之后的data4', data4);
// }


/**
 * 连接蓝牙设备
 * @param {Object} device - 要连接的蓝牙设备对象
 */
const connectDevice = async (device) => {
  device.connecting = 1;
  // 创建BLE连接
  let res = await uni.createBLEConnection({
    deviceId: device.deviceId,
  });

  console.log('连接成功', res);

  uni.onBLEConnectionStateChange(function (res) {
    // 该方法回调中可以用于处理连接意外断开等异常情况
    if (!res.connected) {
      console.log('连接已断开');
    }
    else {
      console.log('连接已建立');
    }
  });
  // let { services } = 
  await uni.getBLEDeviceServices({
    deviceId: device.deviceId,
  })

  await uni.getBLEDeviceCharacteristics({
    deviceId: device.deviceId,
    serviceId: config.serviceUUID,
  })

  // 监听
  await uni.notifyBLECharacteristicValueChange({
    state: true,
    deviceId: device.deviceId,
    serviceId: config.serviceUUID,
    characteristicId: config.notifyUUID,
  })

  device.connecting = 2;
  // 显示连接成功提示
  uni.showToast({
    title: '连接成功',
    icon: 'success'
  });

  uni.onBLECharacteristicValueChange(async function (res) {
    console.log('收到数据', res);
    _data = res
  })
  await attest(device.deviceId);



};

// let data1 = await allThingList({
//   device: {
//     num: 90,
//     keys: ['deviceid', 'uiid', 'name', 'tags', 'params', 'devGroups'],
//     filter: { uiids: [230] }
//   },
//   group: {
//     num: 90,
//     keys: ['id', 'name', 'uiid', 'groupParams', 'mainDeviceId']
//   }
// })

async function attest(deviceId) {
  sendDataToDevice(deviceId, `0A00${getSeqence()}80BFFAFFFEFAA5`, 2);
  let data2 = await getData();
  data2 = BLEEncryptor.decrypt(ab2hex(data2.value), 2);
  console.log('解析之后的data2', data2);
  // 取出最后8位和倒数第十位到倒数第八位的数据

  const securityKey = "906e7a5e";
  let CommandData_Str3 = data2.substring(data2.length - 8, data2.length);
  let CommandData_N3 = data2.substring(data2.length - 10, data2.length - 8);
  if (CommandData_Str3 == crc32.encryptCrc32(securityKey, CommandData_N3)) {
    console.log('设备蓝牙认证成功');
  }

  let CommandData_N4 = (1).toString(16).padStart(2, '0');
  console.log(CommandData_N4, 'CommandData_N4');
  let CommandData_Str4 = crc32.encryptCrc32(securityKey, CommandData_N4)//CommandData_N4 + securityKey;

  console.log(`0E000280BFFAFFFEFB${CommandData_N4}${CommandData_Str4}`);
  sendDataToDevice(deviceId, `0E00${getSeqence()}80BFFAFFFEFB${CommandData_N4}${CommandData_Str4}`, 2);
  let data3 = await getData();
  data3 = BLEEncryptor.decrypt(ab2hex(data3.value), 2);
  if (data3.substring(data3.length - 1) == 0) {
    console.log('认证成功');
  }
}

async function deviceJoin(device) {
  // 发送
  sendDataToDevice(device.deviceId, '09000080BFFAFFFEEF', 2);
  let res1 = await getData();

  let data = BLEEncryptor.decrypt(ab2hex(res1.value), 2);
  let temp = {
    deviceid: device.meta.deviceId.replaceAll(/:/g, ''),
    deviceSign: data.substring(data.length - 8, data.length),
    randomNumber: Number('0x' + data.substring(data.length - 8, data.length - 10)),
  }

  let rsp = await checkDevice(temp);
  let { randomNumber, deviceSign, code } = rsp.data;
  randomNumber = (randomNumber).toString(16).padStart(2, '0');
  device.meta.code = code
  sendDataToDevice(device.deviceId, `0E000180BFFAFFFEFB${randomNumber}${deviceSign}`, 2);
  let res2 = await getData();
  let data2 = BLEEncryptor.decrypt(ab2hex(res2.value), 2);

  if (!(data2.substring(data2.length - 2, data2.length))) {
    disconnectDevice(device);
    return;
  }
  let res3 = await addDevice({
    name: device.meta.deviceType.name,
    deviceTags: {
      name: `${device.meta.deviceType.name}-liu`,
    },
    code: device.meta.code,
  });
}

let _data = null;
const getData = async () => {
  return new Promise((resolve, reject) => {
    let next = () => {
      if (_data) {
        let temp = _data;
        _data = null;
        resolve(temp);
      } else {
        setTimeout(next, 0);
      }
    }
    next();
  });
};

</script>

<style>
/* 主容器样式 */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
}

/* 扫描按钮样式 */
.scan-btn {
  width: 80%;
  height: 80rpx;
  background-color: #007AFF;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40rpx;
  margin-bottom: 30rpx;
}

/* 设备列表容器样式 */
.device-list {
  width: 100%;
}

/* 单个设备项样式 */
.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

/* 设备信息区域样式 */
.device-info {
  display: flex;
  flex: 1;
  flex-direction: column;
}

/* 设备名称文本样式 */
.device-name {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 10rpx;
}

/* 设备ID文本样式 */
.device-id {
  font-size: 24rpx;
  color: #666;
}

/* 连接按钮样式 */
.connect-btn {
  background-color: #4CD964;
  color: #fff;
  font-size: 28rpx;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  min-width: 160rpx;
}

/* 禁用状态的连接按钮样式 */
.connect-btn[disabled] {
  background-color: #ccc;
}

/* 无设备提示样式 */
.no-devices {
  margin-top: 100rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
