/**
 * 蓝牙通信加密工具
 * 基于Seq值生成动态混淆表对数据进行异或加密
 */
export class BLEEncryptor {
    // 混淆字节映射表（40字节）
    private static readonly CONFUSE_TABLE: ReadonlyArray<number> = [
        0x41, 0x92, 0x53, 0x2A, 0xFC, 0xAB, 0xCE, 0x26, 0x0D, 0x1E,
        0x99, 0x78, 0x00, 0x22, 0x99, 0xDE, 0x41, 0x92, 0x53, 0x2A,
        0x23, 0xA1, 0xF5, 0x46, 0x72, 0x9C, 0xDB, 0x31, 0x13, 0x67,
        0x59, 0x3A, 0x1F, 0x49, 0xC3, 0x21, 0x8D, 0x5E, 0x15, 0xB2
    ];

    /**
     * 16进制字符串转字节数组
     */
    private static hexToBytes(hex: string): Uint8Array {
        hex = hex.replace(/^0x/, '');
        if (hex.length % 2 !== 0) throw new Error('Hex string must have even length');
        return new Uint8Array(
            hex.match(/.{2}/g)!.map(byte => parseInt(byte, 16))
        );
    }

    /**
     * 字节数组转16进制字符串
     */
    private static bytesToHex(bytes: Uint8Array): string {
        return Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * 生成混淆字节表（EncodeTable）
     */
    private static generateEncodeTable(seq: number, length: number): Uint8Array {
        const table = new Uint8Array(length);
        const baseIndex = seq % this.CONFUSE_TABLE.length;

        for (let i = 0; i < length; i++) {
            table[i] = this.CONFUSE_TABLE[(baseIndex + i) % this.CONFUSE_TABLE.length];
        }

        return table;
    }

    /**
     * 加密/解密核心逻辑（异或操作）
     */
    private static processData(data: Uint8Array, seq: number, startIndex: number): Uint8Array {
        const dataToProcess = data.slice(startIndex);
        const encodeTable = this.generateEncodeTable(seq, dataToProcess.length);

        // 执行异或操作
        for (let i = 0; i < dataToProcess.length; i++) {
            dataToProcess[i] ^= encodeTable[i];
        }

        // 合并结果
        const result = new Uint8Array(data);
        result.set(dataToProcess, startIndex);
        return result;
    }

    /**
     * 加密函数
     * @param hexString 待加密的16进制字符串
     * @param seqPosition Seq字段的位置（从0开始）
     * @returns 加密后的16进制字符串
     */
    static encrypt(hexString: string, seqPosition: number): string {
        const bytes = this.hexToBytes(hexString);

        // 确保Seq位置有效
        if (seqPosition < 0 || seqPosition >= bytes.length) {
            throw new Error('Invalid Seq position');
        }

        const seq = bytes[seqPosition];
        const encryptedBytes = this.processData(bytes, seq, seqPosition + 1);

        return this.bytesToHex(encryptedBytes);
    }

    /**
     * 解密函数（与加密逻辑完全相同）
     */
    static decrypt(hexString: string, seqPosition: number): string {
        return this.encrypt(hexString, seqPosition);
    }
}
