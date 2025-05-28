import { DeviceTypeMap } from "@/types/device";
import { hexToBuffer } from "./app";
import { BLEEncryptor } from "./crypto";
import config from "@/config";

// 定义广播数据字段接口
interface AdvertiserFields {
    companyId: string;
    versionFlags: string;
    deviceId: string;
    productId: string;
    deviceType: string;
}

// 定义公司信息接口
interface Company {
    id: string;
    name: string;
}

// 定义设备类型接口
interface DeviceType {
    value: number;
    hex: string;
    name: string | undefined;
}

// 定义解析结果接口
interface ParsedAdvertiserData {
    company: Company;
    version: number;
    sourceDevice: boolean;
    supportBTP: boolean;
    connected: boolean;
    visible: boolean;
    deviceType: DeviceType;
    deviceId: string;
    productId: number;
    rawData: string;
}

/** 
 * 解析深圳酷客智能设备的16进制广播数据字符串
 * @param hexStr - 16进制字符串格式的广播数据
 * @returns 解析结果对象，包含各字段信息
 */

// 导出函数声明
export function parseCoolKitAdvertiserData(hexStr: string): ParsedAdvertiserData | null {
    // 检查输入是否有效
    if (!hexStr || typeof hexStr !== 'string') {
        console.warn('无效的输入：必须是16进制字符串');
        return null;
    }

    // 移除空格并转为大写
    const cleanHex = hexStr.replace(/\s/g, '').toUpperCase();

    // 检查长度是否符合预期 (至少12字节 = 24个16进制字符)
    if (cleanHex.length < 24) {
        console.warn(`广播数据长度不足：需要至少24个字符，实际${cleanHex.length}个`);
        return null;
    }

    try {
        // 按字节长度拆分各字段
        const fields: AdvertiserFields = {
            companyId: cleanHex.substring(0, 4),       // 2字节 = 4个字符
            versionFlags: cleanHex.substring(4, 6),    // 1字节 = 2个字符
            deviceId: cleanHex.substring(6, 16),       // 5字节 = 10个字符
            productId: cleanHex.substring(16, 20),     // 2字节 = 4个字符
            deviceType: cleanHex.substring(20, 24)     // 2字节 = 4个字符
        };

        // 解析Version、BTP、Connect、Visibility (从versionFlags字节)
        const flagsByte = parseInt(fields.versionFlags, 16);
        const version = (flagsByte & 0xF0) >> 4;    // 高4位 (7-4)
        const sourceDevice = !!(flagsByte & 0x08);  // bit 3: 发出设备标识
        const supportBTP = !!(flagsByte & 0x04);    // bit 2: BTP支持
        const connected = !!(flagsByte & 0x02);     // bit 1: 连接状态
        const visible = !!(flagsByte & 0x01);       // bit 0: 可见性

        // 格式化DeviceID为冒号分隔的形式
        const deviceIdParts = fields.deviceId.match(/.{2}/g);
        const formattedDeviceId = deviceIdParts?.join(':') ?? fields.deviceId;

        // 使用可选链操作符确保安全调用
        const deviceTypeName = DeviceTypeMap.getTypeName?.(parseInt(fields.deviceType, 16));

        const result: ParsedAdvertiserData = {
            company: {
                id: `0x${fields.companyId}`,
                name: "Shenzhen CoolKit Technology Co.,Ltd"
            },
            version: version,
            sourceDevice: sourceDevice,
            supportBTP: supportBTP,
            connected: connected,
            visible: visible,
            deviceType: {
                value: parseInt(fields.deviceType, 16),
                hex: '0x' + parseInt(fields.deviceType, 16).toString(16).toLocaleUpperCase(),
                name: deviceTypeName
            },
            deviceId: formattedDeviceId,
            productId: parseInt(fields.productId, 16),
            rawData: cleanHex
        };

        return result;
    } catch (error) {
        console.error('解析广播数据出错:', error);
        return null;
    }
}



// 向蓝牙设备发送数据的完整流程
export async function sendDataToDevice(
    deviceId: string,
    data: string,
    seqPosition: number,
    serviceUUID: string = config.serviceUUID,
    writeUUID: string = config.writeUUID
): Promise<boolean> {
    try {
        // 1. 准备数据：将字符串转换为ArrayBuffer
        let encryptedData: string = BLEEncryptor.encrypt(data, seqPosition);
        const buffer: any = hexToBuffer(encryptedData);

        // 2. 写入数据到特征值
        const res = await uni.writeBLECharacteristicValue({
            deviceId,
            serviceId: serviceUUID,
            characteristicId: writeUUID,
            value: buffer
        });

        console.log('数据发送成功:', '加密之前', data, '加密之后', encryptedData);
        sendDataToDevice._seqence++;
        // 发送成功后的逻辑
        return true;
    } catch (err: any) {
        console.error('数据发送失败:', err);
        // 处理失败情况，如重试或提示用户
        switch (err.errCode as number) {
            case 10001: // 蓝牙未初始化
                uni.openBluetoothAdapter({
                    success: () => sendDataToDevice(deviceId, data, seqPosition, serviceUUID, writeUUID),
                    fail: () => uni.showToast({ title: '请开启蓝牙', icon: 'none' })
                });
                break;
            case 10002: // 未找到设备
                uni.showToast({ title: '设备未连接', icon: 'none' });
                break;
            case 10003: // 连接已断开
                uni.showToast({ title: '设备已断开连接', icon: 'none' });
                break;
            default:
                console.error('未知错误:', err);
                uni.showToast({ title: '发送失败，请重试', icon: 'none' });
        }
        return false;
    }
}
sendDataToDevice._seqence = 0

export const getSeqence = () => (sendDataToDevice._seqence).toString(16).padStart(2, '0');
// 断开蓝牙连接
export const disconnectDevice = async (deviceId: string) => {
    uni.showLoading({ title: '正在断开连接...' });
    try {
        await uni.closeBLEConnection({
            deviceId: deviceId
        })
        uni.hideLoading();
        uni.showToast({ title: '已断开连接', icon: 'none' });
        return true;
    }
    catch (e) {
        uni.hideLoading();
        uni.showToast({ title: '断开连接失败', icon: 'none' });
        return false;
    }
}