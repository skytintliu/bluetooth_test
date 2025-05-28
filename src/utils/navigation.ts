// import { UniNamespace.NavigateToOptions } from '@dcloudio/uni-app';

/**
 * 页面跳转工具类
 */
export class Navigation {
  /**
   * 跳转到指定页面
   * @param url - 目标页面路径
   * @param options - 跳转配置项
   */
  static navigateTo(url: string, options?: UniNamespace.NavigateToOptions) {
    uni.navigateTo({
      url,
      ...options
    });
  }

  /**
   * 重定向到指定页面
   * @param url - 目标页面路径
   * @param options - 跳转配置项
   */
  static redirectTo(url: string, options?: UniNamespace.NavigateToOptions) {
    uni.redirectTo({
      url,
      ...options
    });
  }

  /**
   * 返回上一页
   * @param delta - 返回的页面层数
   */
  static navigateBack(delta?: number) {
    uni.navigateBack({
      delta
    });
  }

  /**
   * 跳转到Tab页
   * @param url - 目标页面路径
   */
  static switchTab(url: string) {
    uni.switchTab({
      url
    });
  }

  /**
   * 重启动应用
   * @param url - 目标页面路径
   */
  static reLaunch(url: string) {
    uni.reLaunch({
      url
    });
  }
}