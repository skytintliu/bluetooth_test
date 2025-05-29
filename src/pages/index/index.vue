<template>
    <button @click="startCustomAdvertising()">
        开关灯
    </button>
</template>
<script setup>
import { BLEEncryptor } from '@/utils/crypto';
import { onMounted } from 'vue';

let peripheralServer = null;

onMounted(() => {
    // startCustomAdvertising()
    initBluetooth()
})
function initBluetooth() {
    // 开启蓝牙适配器
    wx.openBluetoothAdapter({
        success: () => {
            // 创建外围设备服务器
            wx.createBLEPeripheralServer({
                success: (res) => {
                    peripheralServer = res.server;
                    // 开始广播数据
                    // startCustomAdvertising();
                },
                fail: (err) => console.error('创建外围设备失败', err)
            });
        },
        fail: (err) => console.error('蓝牙适配器初始化失败', err)
    });
}

// 构建自定义广播数据（不含Service/Characteristic）
function buildCustomAdvertisingData(payload) {
    // 示例：构建包含制造商数据的广播包
    // 格式: [长度, 类型(0xFF=制造商数据), 公司ID(2字节), 自定义数据...]

    // 将字符串转为Uint8Array（兼容写法）
    const payloadArray = typeof payload === 'string'
        ? stringToUint8Array(payload)
        : new Uint8Array(payload);

    // 总长度 = 类型(1) + 公司ID(2) + 数据长度
    const length = 1 + 2 + payloadArray.length;

    // 创建数据缓冲区
    const buffer = new ArrayBuffer(length + 1); // +1 是长度字节本身
    const view = new DataView(buffer);

    // 设置长度字节
    view.setUint8(0, length);

    // 设置数据类型（0xFF = 制造商数据）
    view.setUint8(1, 0xFF);

    // 设置公司ID（示例：0x004C = Apple，可自定义）
    view.setUint16(2, 0x0ACA, true); // 小端序

    // 复制自定义数据
    for (let i = 0; i < payloadArray.length; i++) {
        view.setUint8(4 + i, payloadArray[i]);
    }

    return buffer;
}

const timer = null

let _seq = 128

function getSeq() {
    // if (_seq > 255) {
    //     _seq = 0
    // }
    // return ++_seq;
    return (_seq).toString(16).padStart(2, '0')
}

function startCustomAdvertising() {
    // 自定义数据内容（示例：设备ID和温度值）
    clearTimeout(timer);
    
    // 生成数据
    let avaData = `10ff0aca${getSeq()}00D6BE898E80BFFA000602`;
    avaData = BLEEncryptor.encrypt(avaData, 4);
    let data = `19AAD6BE898E0201xx${avaData}`;
    
    // 构建符合微信小程序要求的广播参数
    const advertiseRequest = {
        advertisingData: buildCustomAdvertisingData(data),
        includeDeviceName: true,    // 是否包含设备名称
        includeTxPowerLevel: false  // 是否包含发射功率
    };
    
    console.log(data, avaData);
    
    // 修正参数结构
    peripheralServer.startAdvertising({
        // 必须包含 advertiseRequest 对象
        advertiseRequest: advertiseRequest,
        deviceName: "abc1233",      // 设备名称
        success: () => console.log('广播已启动'),
        fail: (err) => console.error('启动广播失败', err)
    });

    // 延长广播时间（原来的500ms可能太短，导致接收不到）
    let timer = setTimeout(() => {
        peripheralServer.stopAdvertising({
            success: () => console.log('广播已停止'),
            fail: (err) => console.error('停止广播失败', err)
        });
    }, 3000); // 改为3秒，给接收设备足够时间检测
}

// 兼容的字符串转Uint8Array函数
function stringToUint8Array(str) {
    // 优先使用TextEncoder（如果支持）
    if (typeof TextEncoder !== 'undefined') {
        return new TextEncoder().encode(str);
    }

    // 降级方案：手动将字符串转换为UTF-8编码的Uint8Array
    const utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        if (charCode < 0x80) {
            // ASCII字符（单字节）
            utf8.push(charCode);
        } else if (charCode < 0x800) {
            // 双字节字符
            utf8.push(0xc0 | (charCode >> 6),
                0x80 | (charCode & 0x3f));
        } else if (charCode < 0xd800 || charCode >= 0xe000) {
            // 三字节字符
            utf8.push(0xe0 | (charCode >> 12),
                0x80 | ((charCode >> 6) & 0x3f),
                0x80 | (charCode & 0x3f));
        } else {
            // 处理UTF-16代理对（四字节字符）
            i++;
            charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charCode >> 18),
                0x80 | ((charCode >> 12) & 0x3f),
                0x80 | ((charCode >> 6) & 0x3f),
                0x80 | (charCode & 0x3f));
        }
    }
    return new Uint8Array(utf8);
}
</script>
<style scoped lang="scss"></style>