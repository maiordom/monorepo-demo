import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';
import NanoEvents from 'nanoevents';

export interface IEvent {
  name: string;
}

export interface IRequestError extends AxiosError {}

export interface IRequestConfig {
  method: string;
  url: string;
  params?: any;
  data?: any;
  routeName?: string;
  urlParams?: { [key: string]: string | number };
}

export interface IError<T> {
  code: number;
  data: T;
}

class Request {
  axiosInstance: AxiosInstance;
  emitter: NanoEvents;
  headers: { [key: string]: string };

  setHeaders(headers: { [key: string]: string }) {
    this.headers = headers;
  }

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
      withCredentials: true,
    });

    this.axiosInstance.interceptors.request.use(
      (requestConfig: AxiosRequestConfig) => {
        if (this.headers) {
          Object.assign(requestConfig.headers, this.headers);
        }

        return requestConfig;
      },
      Promise.reject
    );

    this.emitter = new NanoEvents();
  }

  getInstance = () => this.axiosInstance;

  log(
    config: AxiosRequestConfig,
    requestConfig: IRequestConfig,
    requestTime: number,
    responseData: any
  ) {
    if (__ENV__ !== 'development') {
      return;
    }

    const data =
      requestConfig.method === 'GET'
        ? JSON.stringify(requestConfig.params)
        : JSON.stringify(requestConfig.data);

    console.groupCollapsed(
      `${requestConfig.url}::${requestConfig.method}::${requestTime}s`
    );
    console.log(
      [
        `URL: ${config.baseURL}${requestConfig.url}\n\n`,
        `RequestTime: ${requestTime}s\n\n`,
        `Method: ${requestConfig.method}\n\n`,
        `Data: ${data}\n\n`,
      ].join('')
    );

    console.groupCollapsed('Response');
    console.log(JSON.stringify(responseData, null, 2));
    console.groupEnd();

    console.groupEnd();
  }

  call<T>(requestConfig: IRequestConfig, data = {}) {
    const timeStart = new Date().getTime();

    this.emitter.emit('start', {
      name: requestConfig.routeName,
      data,
      params: requestConfig.urlParams,
    });

    if (requestConfig.method === 'GET') {
      requestConfig.params = data;
    } else {
      requestConfig.data = data;
    }

    return this.axiosInstance
      .request<T, AxiosResponse<T>>(requestConfig as AxiosRequestConfig)
      .then(res => {
        const requestTime = (new Date().getTime() - timeStart) / 1000;

        this.log(res.config, requestConfig, requestTime, res.data);
        this.emitter.emit('end', { name: requestConfig.routeName });

        return Promise.resolve(res);
      })
      .catch((exx: AxiosError) => {
        const event: any = {
          name: requestConfig.routeName,
        };
        const requestTime = (new Date().getTime() - timeStart) / 1000;

        this.log(
          exx.config,
          requestConfig,
          requestTime,
          exx?.response?.data || {}
        );
        this.emitter.emit('error', event);

        return Promise.reject({
          code: exx.response && exx.response.status,
          data: (exx.response && exx.response.data) || {},
        });
      });
  }
}

export default new Request(__API_HOST__);
