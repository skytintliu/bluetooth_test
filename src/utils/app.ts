/**
 * 显示消息提示框
 * @param options Toast配置选项或消息文本
 */
export const showToast = (options: UniNamespace.ShowToastOptions | string) => {
    if (typeof options === 'string') {
        uni.showToast({
            title: options,
            icon: 'none'
        });
    } else {
        uni.showToast(options);
    }
};

/**
 * 获取默认头像URL
 * @param url - 头像URL
 * @returns 如果url存在则返回url，否则返回默认头像路径
 */
export const getDefaultAvatar = (url: string): string => {
    return url || '/static/default-avatar.png'
};

export const initData: any = () => { }

export default {
    initData
}

/**
 * 创建并执行数据加载函数
 * @param func 需要执行的异步函数
 * @returns 返回一个Promise，包含执行结果
 */
export const createLoadData = async (func: Function): Promise<any> => {
    uni.showLoading({
        title: "加载中",
    });
    await func();
    uni.hideLoading();
};

/**
 * 将对象转换为查询字符串
 * @param obj - 包含键值对的对象，值可以是字符串、数字或布尔值
 * @returns 转换后的查询字符串，例如 'key1=value1&key2=value2'
 */
export const objectToQueryString = (obj: { [key: string]: string | number | boolean }): string => {
    // 将对象的键值对转换为数组
    const keyValuePairs: [string, string | number | boolean][] = Object.entries(obj);

    // 按照键的字母顺序排序
    keyValuePairs.sort((a, b) => a[0].localeCompare(b[0]));

    // 将排序后的键值对转换为字符串
    const queryString = keyValuePairs.map(pair => `${pair[0]}=${pair[1]}`).join('&');

    return queryString;
}


export const ab2hex = (buffer: ArrayBuffer) => {
    const hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        }
    )
    return hexArr.join('')
}

function hexToByteArray(hexString: string) {
    // 移除前缀0x（如果存在）
    hexString = hexString.replace(/^0x/, '');

    // 确保十六进制字符串长度为偶数
    if (hexString.length % 2 !== 0) {
        hexString = '0' + hexString;
    }

    // 将十六进制字符串转换为字节数组
    const byteArray = [];
    for (let i = 0; i < hexString.length; i += 2) {
        byteArray.push(parseInt(hexString.substr(i, 2), 16));
    }

    return byteArray;
}
export function hexToBuffer(hexString: string) {
    const byteArray = hexToByteArray(hexString);
    const buffer = new ArrayBuffer(byteArray.length);
    const view = new Uint8Array(buffer);

    // 将字节数组复制到ArrayBuffer
    byteArray.forEach((byte, index) => {
        view[index] = byte;
    });

    return buffer;
}