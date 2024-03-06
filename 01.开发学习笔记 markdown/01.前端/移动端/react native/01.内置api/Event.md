# Event
RN 官网上没有暴露 Event 相关的 API，但是 RN 已经对外导出了 DeviceEventEmitter 这个「发布-订阅」事件管理 API，使用也很简单，如下案例使用即可。

import { DeviceEventEmitter } from 'react-native';

// 触发
DeviceEventEmitter.emit('EVENT');
// 监听
const listener = DeviceEventEmitter.addListener( 'EVENT', () => {});
// 移除
listener.remove()