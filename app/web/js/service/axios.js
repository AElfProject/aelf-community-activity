/**
 * @file axios
 * @author hzz780
 * https://github.com/axios/axios
 */
import axios from 'axios';
import {message} from 'antd';
import Cookies from 'js-cookie'

const instance = axios.create({
  timeout: 30000,
  headers: {
    'x-csrf-token': Cookies.get('csrfToken')
  }
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  message.error(error.message || 'Request error');
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  const errorMsg = error.response.data && error.response.data.message;
  message.error(errorMsg || error.message || 'Response error');
  return Promise.reject(error);
});
// export default axios;
export default instance;
