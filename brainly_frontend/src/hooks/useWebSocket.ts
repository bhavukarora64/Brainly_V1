// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';

export const useWebSocket = (userId: string, onMessage: (data: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_BACKEND_BASE_WSS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket Connected");
      if (userId) {
        ws.send(JSON.stringify({ type: "join", payload: { roomId: userId } }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => ws.close();
  }, [userId]);

  return socketRef;
};
