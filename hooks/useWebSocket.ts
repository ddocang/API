'use client';

import { useEffect, useRef } from 'react';

export default function useWebSocket(
  url: string,
  onMessage: (data: any) => void
) {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('✅ WebSocket 연결 성공');
      // 필요한 경우 여기에서 subscribe 메시지 보낼 수 있음
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.error('⚠️ JSON 파싱 실패:', e);
      }
    };

    ws.current.onerror = (err) => {
      console.error('❌ WebSocket 오류:', err);
    };

    ws.current.onclose = () => {
      console.log('🔒 WebSocket 연결 종료');
    };

    return () => {
      ws.current?.close();
    };
  }, [url, onMessage]);
}
