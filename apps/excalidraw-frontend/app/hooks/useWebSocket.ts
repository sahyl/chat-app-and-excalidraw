'use client'
import { useEffect, useState } from "react";

export function useWebSocket(url: string, roomId: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) return 
    const ws = new WebSocket(`${url}?token=${token}`);
    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };

    return () => {
      ws.close();
    };
  }, [url , roomId]);

  return socket;
}
