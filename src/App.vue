<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { getUserInfo, refreshToken } from "@/api/user"
import { useUserStore } from "@/stores"
import app from "@/utils/app";
let func: Function = () => { };
app.initData = new Promise((resolve) => {
  func = resolve;
});

onLaunch(async () => {
  console.log("App Launch");
  let { setAuthTokens, setProfile, } = useUserStore()
  const atExpire = uni.getStorageSync('at_expire');
  const rt = uni.getStorageSync('rt');
  const at = uni.getStorageSync('at');
  if (atExpire && atExpire < Date.now()) {
    console.log('刷新');
    // 调用刷新token的逻辑
    let res = await refreshToken(rt);
    console.log(res.data);

    if (res.error == 0) {
      setAuthTokens(res.data);
    }
  }
  if (at) {
    let res = { "error": 0, "msg": "", data: { "user": { "timezone": { "id": "Asia/Shanghai", "offset": 8 }, "accountLevel": 20, "levelExpiredAt": 1780731695000, "countryCode": "+86", "phoneNumber": "+8615779068738", "apikey": "1dd5f49f-aabd-4265-b1b5-22f67e8134f2", "accountConsult": false, "appForumEnterHide": false, "appVersion": "5.15.6", "denyRecharge": false, "ipCountry": "CN" }, "at": "46657b60e345774e438643fcca804ae88e425d09", "rt": "51599dda255a3aa17bd1091aa3600ce38fad03ce", "region": "cn" } }//await getUserInfo();
    if (res.error == 0) {
      setProfile(res.data);
      console.log('登录成功');
    }
  }

  getUserInfo();
  func();
});
</script>
<style lang="scss">
@use "@/styles/index.scss";
</style>