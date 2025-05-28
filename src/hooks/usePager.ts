import { onReachBottom, onPullDownRefresh } from "@dcloudio/uni-app";
import { Ref } from "vue";

export default (loadData: () => Promise<void>, clear: () => void) => {
    onReachBottom(async () => {
        await loadData();
    });

    onPullDownRefresh(async () => {
        clear();
        // params.page = 1;
        await loadData();
        uni.stopPullDownRefresh();
    });

    return {};
};
