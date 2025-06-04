<template>
    <button @click="startCustomAdvertising()">
        开关灯
    </button>
</template>
<script setup>
import { hexToBuffer } from '@/utils/app';
import { BLEEncryptor } from '@/utils/crypto';
import { onMounted } from 'vue';

let peripheralServer = null;

onMounted(() => {
    initBluetooth()
})
async function initBluetooth() {
    // 开启蓝牙适配器
    await wx.openBluetoothAdapter();
    let res = await wx.createBLEPeripheralServer()
    peripheralServer = res.server;
}

let _seq = 0;

const getSeq = () => (_seq++).toString(16).padStart(2, '0')

let timer = null

// 兼容的字符串转Uint8Array函数
function startCustomAdvertising() {
    clearTimeout(timer);

    // 生成符合文档规范的AdvData
    // const adType = 'FF';
    const version = '08'; // 版本0，设备发出
    // const addr = 'a1548fb0'; // 示例Addr
    const addr = 'bb744b52'; // 示例Addr
    
    const protocolData = '81BFFA000602'; // 示例Protocol Opcode和后续数据
    // const compId = '0ACA';
    let advData = `${getSeq()}${version}${addr}${protocolData}`;

    console.log(advData, advData.length);
    // 加密处理
    advData = BLEEncryptor.encrypt(advData, 0);
    console.log(advData);
    const advertiseRequest = {
        manufacturerData: [
            {
                manufacturerId: 0xCA0A,
                manufacturerSpecificData: hexToBuffer(advData),
            }
        ]
    };

    peripheralServer.startAdvertising({
        advertiseRequest,
        success: () => {
            console.log('广播已启动');
        },
        fail: (err) => console.error('启动广播失败', err)
    });

    // 合理设置广播时间
    timer = setTimeout(() => {
        peripheralServer.stopAdvertising({
            success: () => console.log('广播已停止'),
            fail: (err) => console.error('停止广播失败', err)
        });
    }, 5000); // 3秒
}

</script>
<style scoped lang="scss"></style>

