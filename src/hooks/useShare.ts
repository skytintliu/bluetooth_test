import { onLoad } from "@dcloudio/uni-app";

export default function useShare(): { [key: string]: unknown } {
    onLoad(() => {
        try {
            uni.showShareMenu({
                withShareTicket: true,
                menus: ["shareAppMessage", "shareTimeline"],
            });
        } catch (e: unknown) {
            console.log("不支持分享");
        }
    });

    return {};
}