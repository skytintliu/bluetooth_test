import config from "../config";

export function formatCountdown(milliseconds) {
    // 转换为秒
    const totalSeconds = Math.floor(milliseconds / 1000);

    // 计算天、小时、分钟和秒
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // 格式化输出，确保每个部分都是两位数（如果需要）
    const formattedDays = String(days).padStart(2, "0");
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    let obj = { formattedHours, formattedMinutes, formattedSeconds };
    if (formattedDays != "00") {
        obj.formattedDays = formattedDays;
    }
    return obj;
}

export function getYearMonthDifference(timestamp) {
    // 将时间戳转换为日期对象
    const startDate = new Date(timestamp); // 时间戳单位是秒，需要乘以 1000 转换为毫秒
    const currentDate = new Date(); // 当前时间

    // 获取当前日期和开始日期的年份和月份
    let yearsDiff = currentDate.getFullYear() - startDate.getFullYear();
    let monthsDiff = currentDate.getMonth() - startDate.getMonth();

    // 如果当前月份小于开始月份，调整年份差，并将月份差加 12 个月
    if (monthsDiff < 0) {
        yearsDiff--;
        monthsDiff += 12;
    }

    return { years: yearsDiff, months: monthsDiff };
}

export let initData = () => { }

export default {

}


// JavaScript 实现计算时间差的函数
export function calculateTimeDifference(classTime='0:00', classTimeEnd='0:00') {
    return ""
    // 将时间字符串解析为 Date 对象
    const [startHour, startMinute] = classTime.split(':').map(Number);
    const [endHour, endMinute] = classTimeEnd.split(':').map(Number);

    // 创建 Date 对象
    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    // 计算时间差并转换为分钟
    const timeDifference = (endTime - startTime) / (1000 * 60);

    return timeDifference;
}

export const getChineseZodiac = (birthday, sex) => {
    let cate = [
        "猴",
        "鸡",
        "狗",
        "猪",
        "鼠",
        "牛",
        "虎",
        "兔",
        "龙",
        "蛇",
        "马",
        "羊",
    ];
    const gender = sex == 1 ? '男' : '女';
    let date = new Date(birthday);
    let y = date.getFullYear();
    const url = config.staticURL + `/my/cate/${cate[y % 12]}${gender}@2x.png`
    let obj = {};
    obj.text = `${cate[y % 12]}宝宝`;
    obj.img = url
    obj.icon =
        config.staticURL + `/my_cate/${y % 12}-${sex == 1 ? "m" : "f"}.png`;
    return obj;
}