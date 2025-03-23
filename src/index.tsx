import { onLCP, onINP, onCLS } from 'web-vitals';

onCLS(console.log);
onINP(console.log);
onLCP(console.log);
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './style.css';
import App from '@pages/App';
import './wdyr';
import * as rrweb from 'rrweb';
let events = [];

rrweb.record({
  emit(event) {
    // 将 event 存入 events 数组中
    events.push(event);
  },
});

// save 函数用于将 events 发送至后端存入，并重置 events 数组
function save() {
  const body = JSON.stringify({ events });
  localStorage.setItem('rrweb', body);
}

// 每 10 秒调用一次 save 方法，避免请求过多
setInterval(save, 10 * 1000);
const container = document.getElementById('app');

if (!container) {
  throw new Error('Failed to find the root element');
}
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <App></App>
  </BrowserRouter>
);
