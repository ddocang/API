const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// WebSocket 클라이언트 연결 (외부 실시간 서버 주소 사용)
const ws = new WebSocket(
  'wss://iwxu7qs5h3.execute-api.ap-northeast-2.amazonaws.com/dev'
);

ws.on('open', () => {
  console.log('✅ WebSocket 연결 성공');
});

ws.on('message', (data) => {
  try {
    const parsed = JSON.parse(data);
    console.log('실시간 데이터 수신:', parsed);
    // TODO: 여기서 DB 저장 등 원하는 처리
  } catch (e) {
    console.error('파싱 에러:', e);
  }
});

ws.on('close', () => {
  console.log('🔒 WebSocket 연결 종료');
});

ws.on('error', (err) => {
  console.error('❌ WebSocket 오류:', err);
});

// API 엔드포인트 예시
app.get('/', (req, res) => {
  res.send('Express + WebSocket 서버 정상 동작 중!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중`);
});
