// 定义广告选项接口
interface AdvertiseOptions {
    name?: string;
    serviceUUIDs?: string[];
    manufacturerData?: {
        manufacturerId: number;
        data: ArrayBuffer | number[];
    };
    // 可以根据需要添加更多选项
}

// 定义 BLE 外设服务器接口
interface BLEPeripheralServer {
    advertise: (options: AdvertiseOptions) => void;
    stopAdvertise: () => void;
}

// 扩展 Window 接口以包含 plus 对象
declare global {
    interface Window {
        plus?: {
            bluetooth?: {
                openAdvertise: (options: AdvertiseOptions) => void;
                closeAdvertise: () => void;
                // 可以添加更多蓝牙相关方法的类型定义
            };
            // 可以添加其他 plus 对象的类型定义
        };
    }
}

/**
 * 创建 BLE 外设服务器
 * @returns {BLEPeripheralServer | null} 返回 BLE 外设服务器实例或 null（如果环境不支持）
 */
function createBLEPeripheralServer(): BLEPeripheralServer | null {
    if (!window.plus || !plus.bluetooth) {
        console.error('当前环境不支持BLE外设模式');
        return null;
    }

    return {
        advertise: function (options: AdvertiseOptions): void {
            (plus as any).bluetooth.openAdvertise(options);
        },
        stopAdvertise: function (): void {
            (plus as any).bluetooth.closeAdvertise();
        },
        // 可以添加更多方法
    };
}

// 导出函数和类型
export { createBLEPeripheralServer, BLEPeripheralServer, AdvertiseOptions };