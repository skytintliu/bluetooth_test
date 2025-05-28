// /**
//  * 蓝牙数据加密解密工具（TypeScript）
//  */
// class BLEEncryptor {
//     // 混淆字节映射表（40字节）
//     private static readonly CONFUSE_TABLE: ReadonlyArray<number> = [
//         0x41, 0x92, 0x53, 0x2A, 0xFC, 0xAB, 0xCE, 0x26, 0x0D, 0x1E,
//         0x99, 0x78, 0x00, 0x22, 0x99, 0xDE, 0x41, 0x92, 0x53, 0x2A,
//         0x23, 0xA1, 0xF5, 0x46, 0x72, 0x9C, 0xDB, 0x31, 0x13, 0x67,
//         0x59, 0x3A, 0x1F, 0x49, 0xC3, 0x21, 0x8D, 0x5E, 0x15, 0xB2
//     ];

//     /**
//      * 十六进制字符串转字节数组
//      */
//     private static hexToBytes(hex: string): Uint8Array {
//         hex = hex.replace(/^0x/g, ''); // 移除所有0x前缀
//         if (hex.length % 2 !== 0) throw new Error('Hex string length must be even');
//         return new Uint8Array(hex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
//     }

//     /**
//      * 字节数组转十六进制字符串
//      */
//     private static bytesToHex(bytes: Uint8Array): string {
//         return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
//     }

//     /**
//      * 生成混淆字节表（EncodeTable）
//      */
//     private static generateEncodeTable(seq: number, length: number): Uint8Array {
//         const table = new Uint8Array(length);
//         const baseIndex = seq % this.CONFUSE_TABLE.length;
//         for (let i = 0; i < length; i++) {
//             table[i] = this.CONFUSE_TABLE[(baseIndex + i) % this.CONFUSE_TABLE.length];
//         }
//         return table;
//     }

//     /**
//      * 加密核心逻辑
//      */
//     private static encryptCore(bytes: Uint8Array, seqPosition: number): Uint8Array {
//         const seq: number = bytes[seqPosition];
//         const startIndex: number = seqPosition + 1;
//         const dataLength: number = bytes.length - startIndex;
//         if (dataLength <= 0) return bytes; // 无数据可加密

//         const encodeTable: Uint8Array = this.generateEncodeTable(seq, dataLength);
//         const dataToProcess: Uint8Array = bytes.subarray(startIndex);

//         // 异或加密
//         for (let i = 0; i < dataToProcess.length; i++) {
//             dataToProcess[i] ^= encodeTable[i];
//         }

//         // 合并结果
//         const result: Uint8Array = new Uint8Array(bytes);
//         result.set(dataToProcess, startIndex);
//         return result;
//     }

//     /**
//      * 加密函数
//      * @param hexString 待加密的十六进制字符串（如 "010580BFFAFFFEEF"）
//      * @param seqPosition Seq字段的位置（从0开始）
//      * @returns 加密后的十六进制字符串
//      */
//     static encrypt(hexString: string, seqPosition: number): string {
//         try {
//             const bytes: Uint8Array = this.hexToBytes(hexString);
//             if (seqPosition < 0 || seqPosition >= bytes.length) {
//                 throw new Error(`Invalid Seq position: ${seqPosition}`);
//             }
//             const encryptedBytes: Uint8Array = this.encryptCore(bytes, seqPosition);
//             return this.bytesToHex(encryptedBytes);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 console.error('Encryption failed:', error.message);
//             }
//             throw error;
//         }
//     }

//     /**
//      * 解密函数（与加密逻辑相同）
//      */
//     static decrypt(hexString: string, seqPosition: number): string {
//         return this.encrypt(hexString, seqPosition);
//     }
// }

// // 示例用法
// const hexData: string = "010580BFFAFFFEEF"; // Seq在位置1，值为0x05
// const encrypted: string = BLEEncryptor.encrypt(hexData, 0);
// const decrypted: string = BLEEncryptor.decrypt(encrypted, 0);

// console.log("原始数据:", hexData);
// console.log("加密结果:", encrypted);
// console.log("解密结果:", decrypted);




