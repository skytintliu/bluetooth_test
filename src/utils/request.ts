import app, { objectToQueryString, showToast } from "./app";
import CONFIG from "@/config";
import { generateSignature } from "@/utils/signature";

// 请求配置接口
export interface RequestConfig {
  baseURL?: string;
  timeout?: number;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  dataType?: string;
  responseType?: 'text' | 'arraybuffer';
  [key: string]: any;
}

// 拦截器接口
interface Interceptor<T> {
  onFulfilled: (value: T) => Promise<T> | T;
  onRejected?: (error: any) => Promise<T> | T;
}

// 响应数据接口
interface ResponseData<T = any> {
  data: T;
  statusCode: number;
  header: Record<string, string>;
  cookies: string[];
}

// 拦截器管理器接口
interface Interceptors {
  request: Array<Interceptor<RequestConfig>>;
  response: Array<Interceptor<ResponseData>>;
}

// 错误接口
interface RequestError extends Error {
  errMsg?: string;
  statusCode?: number;
  data?: any;
}

class Request {
  private baseURL: string;
  private timeout: number;
  private interceptors: Interceptors;

  constructor(config: RequestConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 60000;
    this.interceptors = {
      request: [],
      response: []
    };
  }

  // 添加请求拦截器
  addRequestInterceptor(onFulfilled: Interceptor<RequestConfig>['onFulfilled'], onRejected?: Interceptor<RequestConfig>['onRejected']): void {
    this.interceptors.request.push({
      onFulfilled,
      onRejected
    });
  }

  // 添加响应拦截器
  addResponseInterceptor(onFulfilled: Interceptor<ResponseData>['onFulfilled'], onRejected?: Interceptor<ResponseData>['onRejected']): void {
    this.interceptors.response.push({
      onFulfilled,
      onRejected
    });
  }

  // 执行请求拦截器
  private async runRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    for (const interceptor of this.interceptors.request) {
      try {
        config = await interceptor.onFulfilled(config);
      } catch (error) {
        if (interceptor.onRejected) {
          config = await interceptor.onRejected(error);
        } else {
          throw error;
        }
      }
    }
    return config;
  }

  // 执行响应拦截器
  private async runResponseInterceptors(response: ResponseData): Promise<ResponseData> {
    for (const interceptor of this.interceptors.response) {
      try {
        response = await interceptor.onFulfilled(response);
      } catch (error) {
        if (interceptor.onRejected) {
          response = await interceptor.onRejected(error);
        } else {
          throw error;
        }
      }
    }
    return response;
  }

  // 处理请求错误
  private handleError(error: RequestError): Promise<never> {
    const errMsg = error.errMsg || (error.statusCode ? `请求失败(${error.statusCode})` : '请求失败');
    showToast({
      title: errMsg,
      icon: 'none'
    });
    return Promise.reject(error);
  }

  // 发起请求
  async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      // 合并配置
      config = {
        ...config,
        baseURL: this.baseURL,
        timeout: this.timeout
      };

      // 运行请求拦截器
      config = await this.runRequestInterceptors(config);

      // 发起请求
      return new Promise<T>((resolve, reject) => {
        if (config.baseURL && config.url) {
          uni.request({
            ...config,
            url: config.baseURL + config.url,
            success: async (res: any) => {
              try {
                // 运行响应拦截器
                const responseData: ResponseData = {
                  data: res.data,
                  statusCode: res.statusCode,
                  header: res.header || {},
                  cookies: res.cookies || []
                };
                const response = await this.runResponseInterceptors(responseData);
                resolve(response.data as T);
              } catch (error) {
                reject(error);
              }
            },
            error: (error: RequestError) => {
              reject(this.handleError(error));
            }
          });
        }
      });
    } catch (error) {
      return this.handleError(error as RequestError);
    }
  }

  // GET请求
  get<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      data,
      method: 'GET'
    });
  }

  // POST请求
  post<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      data,
      method: 'POST'
    });
  }

  // PUT请求
  put<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      data,
      method: 'PUT'
    });
  }

  // DELETE请求
  delete<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      data,
      method: 'DELETE'
    });
  }
}

// 创建请求实例
const request = new Request({
  baseURL: CONFIG.baseURL,  // 这里可以配置基础URL
  timeout: 60000
});

import { useUserStore } from "@/stores/modules/user";
// 添加默认请求拦截器
request.addRequestInterceptor(
  (config) => {
    // 这里可以添加token等通用请求头
    let header = {
      "X-CK-Appid": CONFIG.appId,
      'Content-Type': "application/json",
      "Authorization": ""
    };

    if (useUserStore().isLogin) {
      header.Authorization = `Bearer ${useUserStore().profile.at || uni.getStorageSync('at')}`
    } else {
      // header.Authorization = 'Sign '

      if (config.method === 'POST') {
        header.Authorization = 'Sign ' + generateSignature(JSON.stringify(config.data))
        console.log("POST请求");
      }
      if (config.method === 'GET') {
        // console.log(JSON.stringify(config.data));
        // header.Authorization = 'Sign ' + generateSignature(objectToQueryString(config.data))
        // console.log("GET请求");

        console.log('你需要先去登录');

      }
    }

    config.header = header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加默认响应拦截器
request.addResponseInterceptor(
  (response) => {
    if (response.data.error == 10004) {
      console.log(10004, '不在服务器');
      // showToast(response.data.error)
    }
    if (response.data.error == 407) {
      return response;
    }
    if (response.data.error) {
      showToast(response.data.msg);
    }

    // 这里可以对响应数据进行统一处理
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;  