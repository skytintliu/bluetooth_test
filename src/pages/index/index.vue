<template>
    <button @click="startCustomAdvertising()">
        开关灯
    </button>
</template>
<script setup>
import { hexToBuffer } from '@/utils/app';
import { BLEEncryptor } from '@/utils/crypto';
import { sendDataToDevice } from '@/utils/device';
import { onMounted } from 'vue';

let peripheralServer = null;


onMounted(() => {
    initBluetooth()
})
async function initBluetooth() {
    // 开启蓝牙适配器
    try {
        await wx.openBluetoothAdapter();
        let res = await uni.createBLEPeripheralServer()
        peripheralServer = res.server;
        console.log('开启外围设备成功');

    }
    catch (e) {
        console.log(e, '开启外围设备错误');
    }
}

let _seq = 0;

const getSeq = () => (_seq++).toString(16).padStart(2, '0')

let timer = null;


// 兼容的字符串转Uint8Array函数
function startCustomAdvertising() {
    const version = '08'; // 版本0，设备发出
    const addr = '2ce83554'; // 示例Addr

    const protocolData = '81bffa000602'; // 示例Protocol Opcode和后续数据    
    // const protocolData = '81BFFAFFFE016464'; // 示例Protocol Opcode和后续数据
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

    peripheralServer.startAdvertising({ advertiseRequest });

    // 合理设置广播时间
    timer = setTimeout(async () => {
        peripheralServer.stopAdvertising();
    }, 2000); // 2秒
}

</script>
<style scoped lang="scss"></style>
